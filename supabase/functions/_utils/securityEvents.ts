/**
 * Security Events Utility for Supabase Edge Functions
 * 
 * Provides centralized security event logging for real-time security monitoring.
 * Integrates with the security_events table and ensures PII-safe data collection.
 * 
 * Features:
 * - IP address hashing (never stores raw IPs)
 * - User agent fingerprinting
 * - Rate limit integration
 * - CSP violation reporting
 * - Authentication anomaly detection
 * 
 * Usage:
 *   import { SecurityEventLogger } from '../_utils/securityEvents.ts';
 *   const logger = new SecurityEventLogger();
 *   await logger.logRateLimitExceeded(request, route, userId);
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Security event types (must match database enum)
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

// Security event severity levels
export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';

// Security event interface
export interface SecurityEventData {
  eventType: SecurityEventType;
  source: string;
  ipAddress: string;
  userId?: string;
  route?: string;
  userAgent?: string;
  countryCode?: string;
  payload?: Record<string, any>;
  severity?: SecurityEventSeverity;
}

// Rate limit event specific payload
export interface RateLimitEventPayload {
  limit: number;
  windowMs: number;
  attempts: number;
  retryAfter: number;
  endpoint: string;
}

// CSP violation event payload
export interface CSPViolationPayload {
  blockedURI?: string;
  documentURI?: string;
  violatedDirective?: string;
  originalPolicy?: string;
  referrer?: string;
  statusCode?: number;
}

// Authentication anomaly payload
export interface AuthAnomalyPayload {
  attemptType: 'login' | 'password_reset' | 'email_change' | 'role_escalation';
  failureReason?: string;
  attemptCount?: number;
  timeWindow?: string;
  suspiciousPatterns?: string[];
}

/**
 * Security Event Logger Class
 * Handles all security event creation and logging
 */
export class SecurityEventLogger {
  private supabase: any;
  private isEnabled: boolean;

  constructor() {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Security monitoring: Missing Supabase credentials, events will not be logged');
      this.isEnabled = false;
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    this.isEnabled = Deno.env.get('SECURITY_MONITORING_ENABLED') !== 'false';
  }

  /**
   * Extract client IP from request headers
   */
  private getClientIP(request: Request): string {
    // Try various headers for real IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    
    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;
    
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) return cfConnectingIP;
    
    // Fallback
    return '127.0.0.1';
  }

  /**
   * Extract user agent from request
   */
  private getUserAgent(request: Request): string {
    return request.headers.get('user-agent') || 'unknown';
  }

  /**
   * Extract user ID from authorization header
   */
  private async extractUserId(request: Request): Promise<string | undefined> {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    try {
      const token = authHeader.substring(7);
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return undefined;
    }
  }

  /**
   * Determine route from request URL
   */
  private getRoute(request: Request): string {
    const url = new URL(request.url);
    return url.pathname.replace(/^\/functions\/[^\/]+/, '');
  }

  /**
   * Get country code from headers (if available)
   */
  private getCountryCode(request: Request): string | undefined {
    // Cloudflare provides country info
    const cfCountry = request.headers.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX') {
      return cfCountry;
    }
    
    return undefined;
  }

  /**
   * Core function to create security event
   */
  async createSecurityEvent(data: SecurityEventData): Promise<string | null> {
    if (!this.isEnabled || !this.supabase) {
      return null;
    }

    try {
      const { data: result, error } = await this.supabase
        .rpc('create_security_event', {
          p_event_type: data.eventType,
          p_source: data.source,
          p_ip_address: data.ipAddress,
          p_user_id: data.userId || null,
          p_route: data.route || null,
          p_user_agent: data.userAgent || null,
          p_country_code: data.countryCode || null,
          p_payload: data.payload || {},
          p_severity: data.severity || 'medium'
        });

      if (error) {
        console.error('Failed to create security event:', error);
        return null;
      }

      return result;
    } catch (error) {
      console.error('Security event creation error:', error);
      return null;
    }
  }

  /**
   * Log rate limit exceeded event
   */
  async logRateLimitExceeded(
    request: Request,
    source: string,
    payload: RateLimitEventPayload,
    userId?: string
  ): Promise<void> {
    const eventData: SecurityEventData = {
      eventType: 'rate_limit_exceeded',
      source,
      ipAddress: this.getClientIP(request),
      userId: userId || await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity: payload.attempts > payload.limit * 2 ? 'high' : 'medium'
    };

    await this.createSecurityEvent(eventData);
  }

  /**
   * Log CSP violation
   */
  async logCSPViolation(
    request: Request,
    source: string,
    payload: CSPViolationPayload
  ): Promise<void> {
    const severity = this.determineCSPViolationSeverity(payload);
    
    const eventData: SecurityEventData = {
      eventType: 'csp_violation',
      source,
      ipAddress: this.getClientIP(request),
      userId: await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity
    };

    await this.createSecurityEvent(eventData);
  }

  /**
   * Log authentication anomaly
   */
  async logAuthAnomaly(
    request: Request,
    source: string,
    payload: AuthAnomalyPayload
  ): Promise<void> {
    const severity = this.determineAuthAnomalySeverity(payload);
    
    const eventData: SecurityEventData = {
      eventType: 'auth_anomaly',
      source,
      ipAddress: this.getClientIP(request),
      userId: await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity
    };

    await this.createSecurityEvent(eventData);
  }

  /**
   * Log RLS policy denial
   */
  async logRLSDenial(
    request: Request,
    source: string,
    payload: { table: string; operation: string; reason?: string }
  ): Promise<void> {
    const eventData: SecurityEventData = {
      eventType: 'rls_denial',
      source,
      ipAddress: this.getClientIP(request),
      userId: await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity: 'high'
    };

    await this.createSecurityEvent(eventData);
  }

  /**
   * Log error burst (multiple errors from same IP)
   */
  async logErrorBurst(
    request: Request,
    source: string,
    payload: { errorCount: number; timeWindow: string; errorTypes: string[] }
  ): Promise<void> {
    const severity = payload.errorCount > 50 ? 'critical' : 'high';
    
    const eventData: SecurityEventData = {
      eventType: 'error_burst',
      source,
      ipAddress: this.getClientIP(request),
      userId: await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity
    };

    await this.createSecurityEvent(eventData);
  }

  /**
   * Log admin action for audit trail
   */
  async logAdminAction(
    request: Request,
    source: string,
    payload: { action: string; target?: string; details?: any },
    userId?: string
  ): Promise<void> {
    const eventData: SecurityEventData = {
      eventType: 'admin_action',
      source,
      ipAddress: this.getClientIP(request),
      userId: userId || await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity: 'medium'
    };

    await this.createSecurityEvent(eventData);
  }

  /**
   * Log suspicious IP activity
   */
  async logSuspiciousIP(
    request: Request,
    source: string,
    payload: { pattern: string; confidence: number; indicators: string[] }
  ): Promise<void> {
    const severity = payload.confidence > 0.8 ? 'high' : 'medium';
    
    const eventData: SecurityEventData = {
      eventType: 'suspicious_ip',
      source,
      ipAddress: this.getClientIP(request),
      userId: await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity
    };

    await this.createSecurityEvent(eventData);
  }

  /**
   * Helper: Determine CSP violation severity
   */
  private determineCSPViolationSeverity(payload: CSPViolationPayload): SecurityEventSeverity {
    const directive = payload.violatedDirective || '';
    
    // Script injections are critical
    if (directive.includes('script-src')) return 'critical';
    
    // Object/frame injections are high severity
    if (directive.includes('object-src') || directive.includes('frame-src')) return 'high';
    
    // Style/image violations are medium
    if (directive.includes('style-src') || directive.includes('img-src')) return 'medium';
    
    return 'low';
  }

  /**
   * Helper: Determine auth anomaly severity
   */
  private determineAuthAnomalySeverity(payload: AuthAnomalyPayload): SecurityEventSeverity {
    if (payload.attemptType === 'role_escalation') return 'critical';
    
    const attempts = payload.attemptCount || 0;
    if (attempts > 10) return 'high';
    if (attempts > 5) return 'medium';
    
    return 'low';
  }

  /**
   * Utility: Create event from request context automatically
   */
  async createEventFromRequest(
    request: Request,
    eventType: SecurityEventType,
    source: string,
    payload?: Record<string, any>,
    severity?: SecurityEventSeverity
  ): Promise<void> {
    const eventData: SecurityEventData = {
      eventType,
      source,
      ipAddress: this.getClientIP(request),
      userId: await this.extractUserId(request),
      route: this.getRoute(request),
      userAgent: this.getUserAgent(request),
      countryCode: this.getCountryCode(request),
      payload,
      severity
    };

    await this.createSecurityEvent(eventData);
  }
}

/**
 * Singleton instance for easy usage across Edge Functions
 */
export const securityLogger = new SecurityEventLogger();

/**
 * Utility function for quick security event creation
 */
export async function logSecurityEvent(
  request: Request,
  eventType: SecurityEventType,
  source: string,
  payload?: Record<string, any>,
  severity?: SecurityEventSeverity
): Promise<void> {
  await securityLogger.createEventFromRequest(request, eventType, source, payload, severity);
}