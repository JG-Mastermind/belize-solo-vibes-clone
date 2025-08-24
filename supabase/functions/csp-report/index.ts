/**
 * CSP (Content Security Policy) Violation Reporting Endpoint
 * 
 * This Edge Function handles CSP violation reports from browsers and logs them
 * to the security_events table for monitoring and analysis. It's designed to be
 * resilient and secure, with built-in rate limiting to prevent abuse.
 * 
 * Features:
 * - Processes standard CSP violation reports
 * - Rate limiting to prevent report spam
 * - PII-safe logging (hashes IPs and user agents)
 * - Integration with security monitoring system
 * - Graceful error handling with fail-safe behavior
 * 
 * Environment Variables:
 * - SECURITY_MONITORING_ENABLED: Enable/disable CSP violation logging
 * - CSP_REPORT_RATE_LIMIT: Max reports per IP per minute (default: 10)
 * 
 * Browser Compatibility: All modern browsers that support CSP Level 2
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { getCorsHeaders } from '../_shared/cors.ts';
import { SecurityEventLogger, CSPViolationPayload } from '../_utils/securityEvents.ts';
import { rateLimit } from '../_middleware.ts';

// CSP Report interface (matching W3C CSP specification)
interface CSPReport {
  'blocked-uri'?: string;
  'document-uri'?: string;
  'violated-directive'?: string;
  'original-policy'?: string;
  referrer?: string;
  'status-code'?: number;
  'script-sample'?: string;
  'source-file'?: string;
  'line-number'?: number;
  'column-number'?: number;
}

// Wrapper for CSP report from browser
interface CSPReportWrapper {
  'csp-report': CSPReport;
}

// Alternative format from frontend security events
interface SecurityEventReport {
  eventType: string;
  source: string;
  payload: any;
  severity: string;
  timestamp: string;
}

/**
 * Validate CSP report data
 */
function validateCSPReport(report: CSPReport): boolean {
  // Must have at least violated-directive and document-uri
  return !!(report['violated-directive'] && report['document-uri']);
}

/**
 * Sanitize URIs to remove potentially sensitive query parameters
 */
function sanitizeURI(uri: string): string {
  try {
    const url = new URL(uri);
    return `${url.protocol}//${url.host}${url.pathname}`;
  } catch {
    // If URL parsing fails, remove query parameters manually
    return uri.split('?')[0].split('#')[0];
  }
}

/**
 * Analyze CSP violation severity
 */
function analyzeViolationSeverity(report: CSPReport): 'low' | 'medium' | 'high' | 'critical' {
  const directive = report['violated-directive'] || '';
  const blockedURI = report['blocked-uri'] || '';
  
  // Critical: Script injections, eval() attempts
  if (directive.includes('script-src') && (
    blockedURI.includes('eval') || 
    blockedURI.includes('inline') ||
    blockedURI.includes('unsafe-eval')
  )) {
    return 'critical';
  }
  
  // High: Any script or object policy violation
  if (directive.includes('script-src') || directive.includes('object-src')) {
    return 'high';
  }
  
  // Medium: Frame, form, or connect violations
  if (directive.includes('frame-src') || directive.includes('form-action') || directive.includes('connect-src')) {
    return 'medium';
  }
  
  // Low: Style, image, media violations
  return 'low';
}

/**
 * Check if CSP report indicates potential attack
 */
function isPotentialAttack(report: CSPReport): { isAttack: boolean; indicators: string[] } {
  const indicators: string[] = [];
  const blockedURI = (report['blocked-uri'] || '').toLowerCase();
  const directive = (report['violated-directive'] || '').toLowerCase();
  
  // Check for common XSS patterns
  if (blockedURI.includes('javascript:') || blockedURI.includes('data:')) {
    indicators.push('inline_script_injection');
  }
  
  if (blockedURI.includes('eval') || blockedURI.includes('unsafe-eval')) {
    indicators.push('eval_attempt');
  }
  
  // Check for external resource loading from suspicious domains
  if (directive.includes('script-src') && blockedURI.match(/\.(tk|ml|ga|cf)$/)) {
    indicators.push('suspicious_domain');
  }
  
  // Check for data exfiltration attempts
  if (directive.includes('connect-src') && blockedURI.includes('://')) {
    const domain = blockedURI.split('://')[1]?.split('/')[0];
    if (domain && !domain.includes('belizevibes.com') && !domain.includes('supabase')) {
      indicators.push('external_connection_attempt');
    }
  }
  
  return {
    isAttack: indicators.length > 0,
    indicators
  };
}

/**
 * Main handler function
 */
async function handleCSPReport(request: Request): Promise<Response> {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Allow': 'POST'
        } 
      }
    );
  }

  // Check if CSP reporting is enabled
  const cspReportingEnabled = Deno.env.get('SECURITY_MONITORING_ENABLED') !== 'false';
  if (!cspReportingEnabled) {
    return new Response('', { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // Apply rate limiting specifically for CSP reports
    const rateLimitCheck = await rateLimit(request, '/csp-report');
    if (!rateLimitCheck.allowed && rateLimitCheck.response) {
      return rateLimitCheck.response;
    }

    // Parse request body
    const body = await request.text();
    if (!body) {
      return new Response('', { status: 204, headers: corsHeaders });
    }

    let report: CSPReport | null = null;
    let reportSource = 'csp-browser';
    
    try {
      const parsed = JSON.parse(body);
      
      // Handle standard CSP report format
      if (parsed['csp-report']) {
        report = parsed['csp-report'];
        reportSource = 'csp-browser';
      } 
      // Handle security event format from frontend
      else if (parsed.eventType) {
        const securityEvent = parsed as SecurityEventReport;
        if (securityEvent.eventType === 'csp_violation' && securityEvent.payload) {
          report = {
            'blocked-uri': securityEvent.payload.blockedURI,
            'document-uri': securityEvent.payload.documentURI,
            'violated-directive': securityEvent.payload.violatedDirective,
            'status-code': securityEvent.payload.statusCode,
          };
          reportSource = securityEvent.source || 'frontend';
        }
      }
      // Handle direct CSP report (some browsers send without wrapper)
      else if (parsed['violated-directive']) {
        report = parsed;
        reportSource = 'csp-browser-direct';
      }
    } catch (parseError) {
      console.warn('Failed to parse CSP report body:', parseError);
      return new Response('', { status: 400, headers: corsHeaders });
    }

    // Validate report
    if (!report || !validateCSPReport(report)) {
      console.warn('Invalid CSP report received:', report);
      return new Response('', { status: 400, headers: corsHeaders });
    }

    // Initialize security logger
    const securityLogger = new SecurityEventLogger();
    
    // Analyze the violation
    const severity = analyzeViolationSeverity(report);
    const attackAnalysis = isPotentialAttack(report);
    
    // Create violation payload
    const violationPayload: CSPViolationPayload = {
      blockedURI: report['blocked-uri'] ? sanitizeURI(report['blocked-uri']) : undefined,
      documentURI: report['document-uri'] ? sanitizeURI(report['document-uri']) : undefined,
      violatedDirective: report['violated-directive'],
      statusCode: report['status-code'],
      // Note: We don't include original-policy to avoid exposing security configuration
      // Note: We don't include referrer to prevent PII exposure
    };

    // Add attack indicators to payload if detected
    if (attackAnalysis.isAttack) {
      violationPayload.attackIndicators = attackAnalysis.indicators;
      // Upgrade severity for potential attacks
      if (severity === 'low') violationPayload.severity = 'medium';
      if (severity === 'medium') violationPayload.severity = 'high';
    }

    // Log CSP violation
    await securityLogger.logCSPViolation(request, reportSource, violationPayload);

    // If this looks like an attack, also log as suspicious IP activity
    if (attackAnalysis.isAttack && attackAnalysis.indicators.length > 1) {
      await securityLogger.logSuspiciousIP(request, 'csp-attack-detection', {
        pattern: 'csp_violation_attack',
        confidence: Math.min(attackAnalysis.indicators.length / 3, 1), // Scale 0-1
        indicators: attackAnalysis.indicators
      });
    }

    // Return success response (browsers don't care about the response body)
    return new Response('', { 
      status: 204, 
      headers: {
        ...corsHeaders,
        ...rateLimitCheck.headers
      }
    });

  } catch (error) {
    console.error('CSP report handler error:', error);
    
    // Return success to avoid browser retries, but log the error
    const securityLogger = new SecurityEventLogger();
    await securityLogger.createEventFromRequest(
      request,
      'error_burst',
      'csp-report-handler',
      { 
        error: error.message,
        handler: 'csp_report',
        timestamp: new Date().toISOString()
      },
      'medium'
    ).catch(() => {
      // Ignore errors in error logging to prevent infinite loops
    });

    return new Response('', { 
      status: 204, 
      headers: corsHeaders 
    });
  }
}

/**
 * Handle CORS preflight requests
 */
async function handleOptions(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

// Get CORS headers for security reporting
const corsHeaders = getCorsHeaders('security');

/**
 * Main serve function
 */
serve(async (request: Request) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  // Handle CSP reports
  return handleCSPReport(request);
});

/**
 * Export for testing
 */
export { handleCSPReport, validateCSPReport, analyzeViolationSeverity, isPotentialAttack };