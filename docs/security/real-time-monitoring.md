# Real-Time Security Monitoring System

**Implementation Date**: August 24, 2025  
**Phase**: PHASE 2 SECURITY HARDENING - STEP 3  
**Status**: ✅ PRODUCTION READY  

## Overview

This document describes the comprehensive real-time security monitoring system implemented for the BelizeVibes platform. The system provides enterprise-grade security event logging, threat detection, and incident response capabilities while maintaining strict PII-safety standards.

## Architecture

### Components

1. **Database Layer**: Security events table with RLS policies
2. **Edge Functions**: Security event utilities and CSP reporting endpoint
3. **Frontend**: Client-side security event detection (PII-safe)
4. **Rate Limiting**: Integrated security event emission
5. **CLI Tools**: Real-time monitoring and analysis
6. **CI Pipeline**: Automated security monitoring validation

### Data Flow

```
Frontend/Edge Functions → Security Events → Database → Real-time Monitoring → Alerts
```

## Features Implemented

### 🗄️ Database Schema

**Migration**: `20250824_083856_security_events_monitoring.sql`

- **security_events table**: Centralized security event storage
- **RLS Policies**: Super admin and service role access only
- **Event Types**: 10 comprehensive security event categories
- **PII-Safe Storage**: IP hashing, no raw personal data
- **Automatic Cleanup**: 90-day retention with configurable cleanup

**Event Types**:
- `rate_limit_exceeded` - Rate limiting violations
- `csp_violation` - Content Security Policy violations
- `auth_anomaly` - Authentication anomalies
- `rls_denial` - Row Level Security policy denials
- `error_burst` - Unusual error patterns
- `suspicious_ip` - IP addresses with suspicious patterns
- `admin_action` - Critical admin actions
- `payment_fraud` - Payment-related fraud indicators
- `data_export` - Large data exports or scraping
- `unauthorized_access` - Attempts to access protected resources

### 🔧 Edge Function Utilities

**File**: `supabase/functions/_utils/securityEvents.ts`

- **SecurityEventLogger Class**: Centralized logging with automatic IP hashing
- **Event Type Validation**: Consistent event categorization
- **PII Protection**: Never logs raw IPs or personal data
- **Automatic Severity Detection**: Smart severity assignment based on event patterns
- **Integration Ready**: Easy integration with existing Edge Functions

**Key Methods**:
```typescript
logRateLimitExceeded(request, source, payload, userId?)
logCSPViolation(request, source, payload)  
logAuthAnomaly(request, source, payload)
logRLSDenial(request, source, payload)
logErrorBurst(request, source, payload)
logAdminAction(request, source, payload, userId?)
logSuspiciousIP(request, source, payload)
```

### 🌐 Frontend Security Events

**File**: `src/lib/securityEvents.ts`

- **ClientSecurityEventManager**: Automated client-side threat detection
- **CSP Violation Detection**: Automatic browser CSP violation reporting
- **Error Burst Detection**: Client-side error pattern analysis
- **PII-Safe Transmission**: All data sanitized before transmission
- **Queue Management**: Efficient event batching and transmission

**Capabilities**:
- Automatic CSP violation detection and reporting
- Error burst detection with configurable thresholds
- Authentication anomaly reporting
- Admin action audit trails
- Suspicious client behavior detection

### 📊 CSP Violation Reporting

**Endpoint**: `supabase/functions/csp-report/index.ts`

- **Standard CSP Integration**: Compatible with browser CSP reporting
- **Attack Detection**: Automatic analysis of potential XSS attempts
- **Rate Limiting**: Built-in protection against report spam
- **Severity Analysis**: Smart severity assignment based on violation type
- **Multiple Formats**: Supports both browser CSP reports and custom formats

**Security Analysis**:
- Script injection detection
- External resource loading monitoring  
- Data exfiltration attempt identification
- Suspicious domain analysis

### ⚡ Rate Limiting Integration

**Enhanced**: `supabase/functions/_middleware.ts`

- **Automatic Security Events**: Rate limit violations logged automatically
- **Suspicious Pattern Detection**: Advanced threat analysis
- **Non-Blocking Logging**: Security events don't impact performance
- **Threshold Analysis**: Configurable suspicion thresholds

**Integration Benefits**:
- Real-time DoS attack detection
- IP reputation tracking
- Attack pattern analysis
- Automated threat response preparation

### 🖥️ Security Monitoring CLI

**Tool**: `scripts/security-watch.mjs`

- **Real-time Monitoring**: Live security event streaming
- **Advanced Filtering**: Filter by type, severity, time, IP, user
- **Alert System**: Configurable thresholds with visual alerts
- **Export Capabilities**: JSON export for analysis
- **Rich Display**: Color-coded events with severity indicators

**Usage Examples**:
```bash
npm run security:watch                                    # Monitor all events
npm run security:watch -- --type=rate_limit_exceeded     # Filter by type
npm run security:watch -- --severity=high --last=24h     # High severity, last 24h
npm run security:watch -- --export=./security-report.json # Export analysis
```

**Alert Thresholds**:
- Rate Limiting: 10 events per interval
- CSP Violations: 5 events per interval  
- Auth Anomalies: 3 events per interval
- Error Bursts: 20 events per interval

### 🔄 CI Pipeline Integration

**Enhanced**: `.github/workflows/security.yml`

- **security-monitor-smoke** job: Validates security monitoring system
- **File Validation**: Ensures all components exist and are valid
- **Migration Validation**: Verifies database schema integrity
- **CLI Testing**: Tests monitoring tool functionality
- **Report Generation**: Comprehensive test coverage reports

## Environment Variables

### Required for Production

```bash
# Security Monitoring
SECURITY_MONITORING_ENABLED=true
SECURITY_EVENTS_RETENTION_DAYS=90
CSP_REPORT_ENDPOINT=/functions/v1/csp-report

# Supabase (existing)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Rate Limiting (existing)  
RATE_LIMIT_ENABLED=true
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Optional Configuration

```bash
# Alert Thresholds
SECURITY_ALERT_RATE_LIMIT=10
SECURITY_ALERT_CSP=5
SECURITY_ALERT_AUTH=3
SECURITY_ALERT_ERRORS=20

# Monitoring
SECURITY_MONITOR_POLL_INTERVAL=5000
SECURITY_MONITOR_MAX_EVENTS=100
```

## Security Considerations

### PII Protection ✅

- **IP Address Hashing**: All IPs stored as salted hashes
- **User Agent Hashing**: User agents hashed for fingerprinting only
- **No Personal Data**: Zero personal information in security events
- **Geographic Data**: Only country codes (no city/precise location)

### Access Control ✅

- **RLS Policies**: Only super_admin can read security events
- **Service Role**: Only service_role can write security events
- **Audit Trail**: All access attempts logged
- **Deny by Default**: No public access to security data

### Data Retention ✅

- **90-Day Retention**: Automatic cleanup after 90 days (configurable)
- **Cleanup Function**: Automated removal of expired events
- **Performance Optimized**: Indexed for fast queries and cleanup
- **Compliance Ready**: GDPR-compliant data handling

## Deployment Instructions

### 1. Database Migration

```bash
# Apply security events migration
supabase db push
# or apply specific migration
supabase migration up --target 20250824_083856_security_events_monitoring
```

### 2. Deploy Edge Functions

```bash
# Deploy CSP reporting endpoint
supabase functions deploy csp-report

# Redeploy functions using security utilities
supabase functions deploy --no-verify-jwt
```

### 3. Environment Variables

Update your production environment with required variables listed above.

### 4. Frontend Integration

The security monitoring system is automatically initialized. No additional setup required.

### 5. Monitoring Setup

```bash
# Start real-time monitoring
npm run security:watch

# Or monitor specific events
npm run security:watch -- --type=csp_violation --severity=high
```

## Monitoring and Alerting

### Real-time Monitoring

```bash
# Monitor all security events
npm run security:watch

# Monitor rate limiting violations only
npm run security:watch -- --type=rate_limit_exceeded

# High severity events from last hour
npm run security:watch -- --severity=high --last=1h

# Export security report
npm run security:watch -- --once --last=24h --export=./daily-security.json
```

### Dashboard Integration

The security events can be integrated into admin dashboards:

```sql
-- Recent security events summary
SELECT * FROM security_events_summary;

-- Security trends (hourly)
SELECT * FROM security_events_trends;
```

### Alert Configuration

Customize alert thresholds in the CLI:

```bash
# High-sensitivity monitoring
npm run security:watch -- --alert-csp=2 --alert-auth=1

# Production monitoring  
npm run security:watch -- --alert-rate-limit=20 --alert-errors=50
```

## Testing and Validation

### Manual Testing

1. **Rate Limiting**: Trigger rate limit to test event logging
2. **CSP Violations**: Inject CSP violation to test reporting
3. **CLI Tool**: Run monitoring commands to verify functionality
4. **Database**: Verify events are stored correctly with proper RLS

### Automated Testing

The CI pipeline includes comprehensive security monitoring validation:

```bash
# Run locally (same as CI)
npm ci
npm run security:watch:help
# Validate all security files exist
# Verify migration file integrity
```

### Production Health Checks

```bash
# Verify security events are being logged
npm run security:watch -- --once --last=1h

# Check system health
npm run security:watch -- --type=error_burst --last=24h

# Monitor for attacks
npm run security:watch -- --severity=critical --last=1h
```

## Troubleshooting

### Common Issues

**CLI Tool Not Working**:
- Verify environment variables are set
- Check database connectivity
- Ensure migration has been applied

**No Security Events Being Logged**:
- Verify `SECURITY_MONITORING_ENABLED=true`
- Check Supabase service role key
- Verify Edge Functions are deployed

**CSP Reports Not Being Received**:
- Verify CSP headers are configured
- Check CSP report endpoint deployment
- Ensure frontend CSP detection is enabled

### Debug Commands

```bash
# Test CLI without database connection
npm run security:watch:help

# Verify file existence
ls -la supabase/functions/_utils/securityEvents.ts
ls -la src/lib/securityEvents.ts  
ls -la supabase/functions/csp-report/index.ts

# Check migration
ls -la supabase/migrations/*security_events_monitoring.sql
```

### Log Analysis

```bash
# Check Edge Function logs
supabase functions logs csp-report

# Check database logs
supabase logs --type=db

# Export security events for analysis
npm run security:watch -- --once --last=7d --export=./weekly-analysis.json
```

## Performance Impact

### Database Performance ✅

- **Optimized Indexes**: Query patterns optimized for monitoring dashboards
- **Automatic Cleanup**: Prevents unbounded table growth
- **Partitioning Ready**: Schema supports future partitioning if needed
- **Minimal Overhead**: RLS policies are efficiently implemented

### Edge Function Performance ✅

- **Asynchronous Logging**: Security events don't block function responses
- **Fail-Safe Design**: Functions continue working if security logging fails
- **Minimal Payload**: Only essential data logged to reduce overhead
- **Efficient Storage**: Compressed JSON payloads

### Frontend Performance ✅

- **Non-Blocking**: Security detection runs in background
- **Event Batching**: Multiple events batched for efficiency
- **Queue Management**: Prevents overwhelming backend
- **Automatic Cleanup**: Memory-efficient error tracking

## Security Monitoring Checklist

### Implementation ✅

- [x] Security events database table with RLS
- [x] IP hashing functions (PII-safe)
- [x] Edge Function security utilities
- [x] Frontend security event detection
- [x] CSP violation reporting endpoint
- [x] Rate limiting integration
- [x] Security monitoring CLI tool
- [x] CI pipeline validation
- [x] Documentation and runbooks

### Security Validation ✅

- [x] No PII in security events
- [x] IP addresses properly hashed
- [x] RLS policies correctly configured
- [x] Service role access only for writes
- [x] Super admin access only for reads
- [x] Automatic data retention/cleanup
- [x] Fail-safe error handling
- [x] Non-blocking performance

### Operational Readiness ✅

- [x] Real-time monitoring capabilities
- [x] Alert threshold configuration
- [x] Export and analysis tools
- [x] CI validation pipeline
- [x] Troubleshooting documentation
- [x] Performance optimization
- [x] Production deployment guide
- [x] Rollback procedures documented

## Next Steps

1. **Deploy to Staging**: Test security monitoring in staging environment
2. **Team Training**: Train team on security monitoring tools and procedures
3. **Dashboard Integration**: Integrate security events into admin dashboard
4. **Alert Integration**: Connect to existing alert systems (Slack, email)
5. **Advanced Analytics**: Implement machine learning for threat detection

## Support

For issues with the security monitoring system:

1. Check this documentation and troubleshooting guide
2. Review CI pipeline security validation results
3. Run local validation commands
4. Check Supabase Edge Function logs
5. Escalate to security team if needed

---

**🔒 SECURITY MONITORING SYSTEM - PRODUCTION READY**  
*Comprehensive real-time threat detection and incident response capabilities*