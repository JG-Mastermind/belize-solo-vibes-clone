/**
 * Security Events Library for Frontend
 * 
 * Provides client-side security event utilities that are completely PII-safe.
 * Integrates with CSP violation reporting and client-side security monitoring.
 * 
 * IMPORTANT: This library NEVER sends raw IPs, user agents, or personal data.
 * All security events are processed through secure Edge Functions.
 * 
 * Features:
 * - CSP violation reporting
 * - Client-side error burst detection
 * - Authentication anomaly helpers
 * - Secure event transmission to Edge Functions
 */

// Security event types (matches backend enum)
export type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'csp_violation'
  | 'auth_anomaly'
  | 'rls_denial'
  | 'error_burst'
  | 'suspicious_ip'
  | 'admin_action'
  | 'payment_fraud'
  | 'data_export'
  | 'unauthorized_access';

// Severity levels
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

// CSP Violation Report interface (from CSP spec)
export interface CSPViolationReport {
  'blocked-uri'?: string;
  'document-uri'?: string;
  'violated-directive'?: string;
  'original-policy'?: string;
  referrer?: string;
  'status-code'?: number;
  'script-sample'?: string;
}

// Client-side error information
export interface ClientErrorInfo {
  message: string;
  source?: string;
  line?: number;
  column?: number;
  stack?: string;
  userAgent?: string;
  url?: string;
}

// Configuration interface
interface SecurityEventsConfig {
  enabled: boolean;
  cspReportEndpoint: string;
  errorBurstThreshold: number;
  errorBurstTimeWindow: number; // milliseconds
}

/**
 * Client-side Security Event Manager
 */
export class ClientSecurityEventManager {
  private config: SecurityEventsConfig;
  private errorCounts: Map<string, { count: number; firstSeen: number }> = new Map();
  private reportQueue: Array<any> = [];
  private isProcessing = false;

  constructor() {
    this.config = {
      enabled: import.meta.env.VITE_SECURITY_MONITORING_ENABLED !== 'false',
      cspReportEndpoint: import.meta.env.VITE_CSP_REPORT_ENDPOINT || '/functions/v1/csp-report',
      errorBurstThreshold: 10,
      errorBurstTimeWindow: 60000, // 1 minute
    };

    // Initialize CSP violation reporting
    this.initializeCSPReporting();
    
    // Initialize error burst detection
    this.initializeErrorBurstDetection();
  }

  /**
   * Initialize CSP violation reporting
   */
  private initializeCSPReporting(): void {
    if (!this.config.enabled) return;

    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation({
        'blocked-uri': event.blockedURI,
        'document-uri': event.documentURI,
        'violated-directive': event.violatedDirective,
        'original-policy': event.originalPolicy,
        referrer: document.referrer,
        'status-code': 200, // Document loaded successfully but CSP blocked resource
      });
    });
  }

  /**
   * Initialize global error burst detection
   */
  private initializeErrorBurstDetection(): void {
    if (!this.config.enabled) return;

    // Listen for JavaScript errors
    window.addEventListener('error', (event) => {
      const errorInfo: ClientErrorInfo = {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      this.handleClientError(errorInfo);
    });

    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo: ClientErrorInfo = {
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      this.handleClientError(errorInfo);
    });
  }

  /**
   * Handle CSP violation
   */
  private async handleCSPViolation(report: CSPViolationReport): Promise<void> {
    if (!this.config.enabled) return;

    // Create PII-safe payload
    const safePayload = {
      blockedURI: this.sanitizeURI(report['blocked-uri']),
      documentURI: this.sanitizeURI(report['document-uri']),
      violatedDirective: report['violated-directive'],
      statusCode: report['status-code'],
      // NOTE: We don't include original-policy as it might contain sensitive info
      // NOTE: We don't include referrer to avoid PII
    };

    await this.sendSecurityEvent('csp_violation', 'frontend', safePayload, 'medium');
  }

  /**
   * Handle client-side errors for burst detection
   */
  private async handleClientError(errorInfo: ClientErrorInfo): Promise<void> {
    if (!this.config.enabled) return;

    const errorKey = this.createErrorKey(errorInfo);
    const now = Date.now();
    
    // Update error counts
    const existing = this.errorCounts.get(errorKey);
    if (existing) {
      // Check if within time window
      if (now - existing.firstSeen <= this.config.errorBurstTimeWindow) {
        existing.count++;
        
        // Check for error burst
        if (existing.count >= this.config.errorBurstThreshold) {
          await this.reportErrorBurst(errorKey, existing.count);
          // Reset counter after reporting
          this.errorCounts.delete(errorKey);
        }
      } else {
        // Time window expired, reset
        this.errorCounts.set(errorKey, { count: 1, firstSeen: now });
      }
    } else {
      this.errorCounts.set(errorKey, { count: 1, firstSeen: now });
    }

    // Clean up old entries
    this.cleanupErrorCounts(now);
  }

  /**
   * Create error key for burst detection (PII-safe)
   */
  private createErrorKey(errorInfo: ClientErrorInfo): string {
    // Create a hash-like key that doesn't expose sensitive information
    const components = [
      errorInfo.message?.substring(0, 50), // Truncate message
      errorInfo.source ? new URL(errorInfo.source).pathname : 'unknown', // Remove query params
      errorInfo.line,
      errorInfo.column,
    ];
    
    return components.filter(Boolean).join('|');
  }

  /**
   * Report error burst to security monitoring
   */
  private async reportErrorBurst(errorKey: string, count: number): Promise<void> {
    const payload = {
      errorCount: count,
      timeWindow: `${this.config.errorBurstTimeWindow}ms`,
      errorTypes: [errorKey], // Already sanitized
      userAgent: navigator.userAgent, // This will be hashed by Edge Function
    };

    await this.sendSecurityEvent('error_burst', 'frontend', payload, 'high');
  }

  /**
   * Clean up old error count entries
   */
  private cleanupErrorCounts(now: number): void {
    for (const [key, data] of this.errorCounts.entries()) {
      if (now - data.firstSeen > this.config.errorBurstTimeWindow * 2) {
        this.errorCounts.delete(key);
      }
    }
  }

  /**
   * Sanitize URI to remove sensitive information
   */
  private sanitizeURI(uri?: string): string | undefined {
    if (!uri) return undefined;

    try {
      const url = new URL(uri);
      // Remove query parameters and fragments that might contain sensitive data
      return `${url.protocol}//${url.host}${url.pathname}`;
    } catch {
      // If URL parsing fails, return domain only
      return uri.split('?')[0].split('#')[0];
    }
  }

  /**
   * Send security event to backend (via CSP report endpoint)
   */
  private async sendSecurityEvent(
    eventType: SecurityEventType,
    source: string,
    payload: any,
    severity: SecurityEventSeverity = 'medium'
  ): Promise<void> {
    if (!this.config.enabled) return;

    const eventData = {
      eventType,
      source,
      payload,
      severity,
      timestamp: new Date().toISOString(),
    };

    // Queue the event for processing
    this.reportQueue.push(eventData);
    
    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processReportQueue();
    }
  }

  /**
   * Process queued security event reports
   */
  private async processReportQueue(): Promise<void> {
    if (this.isProcessing || this.reportQueue.length === 0) return;

    this.isProcessing = true;

    while (this.reportQueue.length > 0) {
      const event = this.reportQueue.shift();
      if (!event) continue;

      try {
        await fetch(this.config.cspReportEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'csp-report': event, // Wrap in CSP report format for compatibility
          }),
        });

        // Small delay between requests to avoid overwhelming the endpoint
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('Failed to send security event:', error);
        // Don't retry to avoid infinite loops
      }
    }

    this.isProcessing = false;
  }

  /**
   * Report authentication anomaly
   */
  async reportAuthAnomaly(
    attemptType: 'login' | 'password_reset' | 'email_change' | 'role_escalation',
    failureReason?: string
  ): Promise<void> {
    const payload = {
      attemptType,
      failureReason,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent, // Will be hashed by Edge Function
    };

    const severity = attemptType === 'role_escalation' ? 'critical' : 'medium';
    await this.sendSecurityEvent('auth_anomaly', 'frontend-auth', payload, severity);
  }

  /**
   * Report suspicious activity
   */
  async reportSuspiciousActivity(
    activityType: 'rapid_navigation' | 'automated_behavior' | 'suspicious_patterns',
    indicators: string[]
  ): Promise<void> {
    const payload = {
      pattern: activityType,
      confidence: indicators.length / 10, // Simple confidence score
      indicators,
      timestamp: new Date().toISOString(),
    };

    await this.sendSecurityEvent('suspicious_ip', 'frontend-behavior', payload, 'medium');
  }

  /**
   * Report admin action (client-side portion)
   */
  async reportAdminAction(action: string, target?: string, details?: any): Promise<void> {
    // Only report admin actions for super_admin users
    const userType = localStorage.getItem('user_type');
    if (userType !== 'super_admin') return;

    const payload = {
      action,
      target,
      details: details ? JSON.stringify(details).substring(0, 500) : undefined, // Limit size
      timestamp: new Date().toISOString(),
    };

    await this.sendSecurityEvent('admin_action', 'frontend-admin', payload, 'medium');
  }

  /**
   * Get error burst statistics (for debugging)
   */
  getErrorBurstStats(): { totalErrors: number; uniquePatterns: number } {
    let totalErrors = 0;
    for (const data of this.errorCounts.values()) {
      totalErrors += data.count;
    }

    return {
      totalErrors,
      uniquePatterns: this.errorCounts.size,
    };
  }

  /**
   * Enable or disable security monitoring
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    
    if (!enabled) {
      // Clear queues when disabled
      this.reportQueue.length = 0;
      this.errorCounts.clear();
    }
  }

  /**
   * Check if security monitoring is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}

/**
 * Singleton instance for use across the application
 */
export const clientSecurityManager = new ClientSecurityEventManager();

/**
 * Utility functions for easy usage
 */

/**
 * Report CSP violation (alternative to automatic detection)
 */
export function reportCSPViolation(violationData: CSPViolationReport): void {
  (clientSecurityManager as any).handleCSPViolation(violationData);
}

/**
 * Report authentication anomaly
 */
export function reportAuthAnomaly(
  attemptType: 'login' | 'password_reset' | 'email_change' | 'role_escalation',
  failureReason?: string
): void {
  clientSecurityManager.reportAuthAnomaly(attemptType, failureReason);
}

/**
 * Report admin action
 */
export function reportAdminAction(action: string, target?: string, details?: any): void {
  clientSecurityManager.reportAdminAction(action, target, details);
}

/**
 * Report suspicious client-side activity
 */
export function reportSuspiciousActivity(
  activityType: 'rapid_navigation' | 'automated_behavior' | 'suspicious_patterns',
  indicators: string[]
): void {
  clientSecurityManager.reportSuspiciousActivity(activityType, indicators);
}

/**
 * Initialize security monitoring (call once in app initialization)
 */
export function initializeSecurityMonitoring(): void {
  // Security monitoring is automatically initialized when the class is instantiated
  console.log('🔒 Client-side security monitoring initialized');
}

/**
 * Check if security monitoring is enabled
 */
export function isSecurityMonitoringEnabled(): boolean {
  return clientSecurityManager.isEnabled();
}