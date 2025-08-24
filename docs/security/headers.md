# BelizeVibes Security Headers Implementation Guide

## Overview

This guide provides comprehensive instructions for implementing production-grade security headers for the BelizeVibes tourism platform. The implementation follows a phased approach to ensure safe deployment without breaking existing functionality.

## Quick Start

```bash
# Validate current security headers setup
node scripts/check-headers.mjs

# Run in CI mode (with exit codes)
node scripts/check-headers.mjs --ci

# Production readiness check
node scripts/check-headers.mjs --production
```

## Architecture

### Development Environment
- **File**: `vite.config.ts`
- **Headers**: Basic security headers for local development
- **CSP**: Permissive policy with `unsafe-inline` and `unsafe-eval`
- **Purpose**: Development and testing with external services (Stripe, Supabase)

### Production Environment
- **Files**: `server/headers/nginx.conf`, `server/headers/apache.htaccess`
- **Headers**: Enterprise-grade security configuration
- **CSP**: Strict policy starting in Report-Only mode
- **Purpose**: Production deployment with phased rollout approach

## Security Headers Implementation

### Core Security Headers

#### 1. Content Security Policy (CSP)
**Purpose**: Prevent XSS attacks by controlling resource loading

**Development Configuration** (vite.config.ts):
```javascript
'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; font-src 'self' data:;"
```

**Production Configuration** (nginx/apache):
- **Phase 1**: Content-Security-Policy-Report-Only
- **Phase 2**: Content-Security-Policy (enforcement)

#### 2. X-Frame-Options
**Purpose**: Prevent clickjacking attacks
**Value**: `DENY`
**Impact**: Prevents embedding in frames/iframes

#### 3. X-Content-Type-Options
**Purpose**: Prevent MIME type sniffing
**Value**: `nosniff`
**Impact**: Forces browsers to respect declared MIME types

#### 4. Referrer-Policy
**Purpose**: Control referrer information leakage
**Value**: `strict-origin-when-cross-origin`
**Impact**: Sends referrer only to same origin or HTTPS destinations

#### 5. Permissions-Policy
**Purpose**: Control browser feature access
**Value**: `camera=(), microphone=(), geolocation=(), payment=('self' https://js.stripe.com)`
**Impact**: Disables unnecessary browser features, allows payment processing

### Advanced Security Headers

#### 6. Strict-Transport-Security (HSTS) - DISABLED BY DEFAULT
**Status**: ⚠️ **DISABLED** - Manual enablement required
**Purpose**: Force HTTPS connections
**Critical Considerations**:
- 12+ month commitment once enabled
- Affects ALL subdomains if `includeSubDomains` is used
- Cannot be easily reversed
- Requires careful planning

**To Enable**:
1. Ensure all subdomains support HTTPS
2. Plan domain preload strategy
3. Understand rollback implications
4. Uncomment HSTS header in production templates

#### 7. Cross-Origin Policies (Optional)
- **Cross-Origin-Opener-Policy**: Enhanced origin isolation
- **Cross-Origin-Embedder-Policy**: Embedding controls
- **Status**: Commented out (enable if needed)

## Phased Rollout Strategy

### Phase 1: CSP Report-Only Mode (SAFE START) ✅
**Objective**: Validate CSP policy without breaking functionality

**Steps**:
1. Deploy production templates with `Content-Security-Policy-Report-Only`
2. Set up CSP report endpoint at `/api/csp-report`
3. Monitor reports for 2-4 weeks
4. Document legitimate violations
5. Adjust CSP policy as needed

**Safety**: Non-breaking - only reports violations, doesn't block resources

**Validation**:
```bash
# Check headers in staging
curl -I https://staging.belizevibes.com

# Look for
Content-Security-Policy-Report-Only: ...
```

### Phase 2: CSP Enforcement Mode
**Objective**: Enforce CSP policy after validation

**Prerequisites**:
- Phase 1 completed successfully
- All legitimate CSP violations resolved
- No false positives in CSP reports

**Steps**:
1. Update production templates
2. Change `Content-Security-Policy-Report-Only` to `Content-Security-Policy`
3. Deploy to staging first
4. Test all critical user flows
5. Deploy to production
6. Monitor for any breaking changes

**Risk**: Medium - may block legitimate resources if not properly tested

### Phase 3: HSTS Enablement (MANUAL DECISION REQUIRED)
**Objective**: Force HTTPS for all connections

**Prerequisites**:
- All domains and subdomains support HTTPS
- SSL certificates properly configured
- Understanding of 12+ month commitment
- Rollback plan in case of issues

**Steps**:
1. Plan subdomain HTTPS coverage
2. Test HTTPS enforcement across all services
3. Uncomment HSTS header in production templates
4. Set appropriate `max-age` (start with 300 seconds for testing)
5. Monitor for issues
6. Gradually increase `max-age` to full value (31536000)
7. Consider browser preload list submission

**Risk**: High - irreversible for extended period

## External Service Integration

### Stripe Payment Processing
**CSP Requirements**:
- `script-src`: `https://js.stripe.com`
- `frame-src`: `https://js.stripe.com https://hooks.stripe.com`
- `connect-src`: `https://api.stripe.com https://*.stripe.com`
- `permissions-policy`: `payment=('self' https://js.stripe.com)`

### Supabase Backend Services
**CSP Requirements**:
- `script-src`: `https://*.supabase.co`
- `connect-src`: `https://*.supabase.co wss://*.supabase.co`
- `img-src`: `https://*.supabase.co` (for uploaded images)

### Google Services (if used)
**CSP Requirements**:
- `script-src`: `https://www.google.com https://www.gstatic.com`
- `style-src`: `https://fonts.googleapis.com`
- `font-src`: `https://fonts.gstatic.com`

## Testing & Validation

### Local Testing
```bash
# Start development server
npm run dev

# Check development headers
curl -I http://localhost:5173

# Run header validation
node scripts/check-headers.mjs
```

### Staging Validation
```bash
# Test production headers in staging
curl -I https://staging.belizevibes.com

# Verify CSP Report-Only mode
curl -I https://staging.belizevibes.com | grep -i content-security-policy

# Check for HSTS (should be absent initially)
curl -I https://staging.belizevibes.com | grep -i strict-transport-security
```

### Critical Test Cases
1. **Payment Flow**: Complete Stripe checkout process
2. **Authentication**: Supabase login/logout flows
3. **Image Loading**: Verify all images load correctly
4. **External Assets**: Fonts, icons, third-party resources
5. **WebSocket Connections**: Real-time Supabase features
6. **API Calls**: All AJAX/fetch requests to Supabase

## Monitoring & Maintenance

### CSP Report Monitoring
Set up endpoint to collect CSP violation reports:
```javascript
// /api/csp-report endpoint
app.post('/api/csp-report', (req, res) => {
  console.log('CSP Violation:', req.body);
  // Log to monitoring system
  res.status(200).send('OK');
});
```

### Log Analysis
Monitor for common violations:
- `'unsafe-inline'` script/style usage
- External domain access attempts  
- Image loading from non-whitelisted domains
- WebSocket connection failures

### Regular Reviews
- **Weekly**: Review CSP reports during Phase 1
- **Monthly**: Security header configuration updates
- **Quarterly**: Full security posture assessment

## Troubleshooting

### Common CSP Issues

#### 1. Images Not Loading
**Symptom**: Missing images, broken image icons
**Solution**: Add image domains to `img-src` directive
```
img-src 'self' data: https: https://yourdomain.com
```

#### 2. Stripe Checkout Broken
**Symptom**: Payment forms not rendering
**Solution**: Ensure Stripe domains in CSP
```
script-src 'self' https://js.stripe.com
frame-src 'self' https://js.stripe.com https://hooks.stripe.com
```

#### 3. Supabase Real-time Errors
**Symptom**: WebSocket connection failures
**Solution**: Add WebSocket connect permissions
```
connect-src 'self' https://*.supabase.co wss://*.supabase.co
```

#### 4. Font Loading Issues
**Symptom**: Fallback fonts displayed
**Solution**: Allow font sources
```
font-src 'self' data: https://fonts.gstatic.com
```

### HSTS Issues

#### 1. Subdomain Access Problems
**Symptom**: Subdomains not accessible after HSTS enablement
**Solution**: Ensure all subdomains have valid HTTPS certificates

#### 2. Mixed Content Warnings
**Symptom**: Browser warnings about insecure content
**Solution**: Update all HTTP references to HTTPS

## Production Deployment Checklist

### Pre-Deployment
- [ ] Run `node scripts/check-headers.mjs --ci` (exit code 0)
- [ ] Validate CSP policy doesn't break critical flows
- [ ] Confirm HSTS is disabled initially
- [ ] Test in staging environment
- [ ] Set up CSP report monitoring

### Deployment Steps
- [ ] Deploy production templates (nginx.conf or apache.htaccess)
- [ ] Verify headers via `curl -I https://yourdomain.com`
- [ ] Confirm CSP Report-Only mode is active
- [ ] Test critical user flows
- [ ] Monitor CSP reports

### Post-Deployment
- [ ] Monitor application for 24 hours
- [ ] Review CSP violation reports
- [ ] Document any issues or exceptions
- [ ] Plan Phase 2 enforcement timeline

## Emergency Procedures

### CSP Enforcement Breaking Site
1. **Immediate**: Switch back to CSP Report-Only mode
2. **Analysis**: Review CSP violation reports
3. **Fix**: Update CSP policy or application code
4. **Retest**: Validate fix in staging
5. **Redeploy**: Cautious re-enforcement

### HSTS Causing Issues
1. **Note**: HSTS cannot be easily disabled once set
2. **Mitigation**: Ensure HTTPS works for affected domains
3. **Long-term**: Wait for HSTS max-age to expire
4. **Prevention**: Always test HSTS with short max-age first

## Security Headers Best Practices

### Development Guidelines
1. **Start Permissive**: Begin with relaxed policies in development
2. **Test Early**: Validate security headers impact during development
3. **Document Decisions**: Record why specific CSP directives are needed
4. **Review Regularly**: Audit CSP policy as application evolves

### Production Guidelines
1. **Phased Approach**: Always use CSP Report-Only before enforcement
2. **Monitor Actively**: Set up proper violation reporting and monitoring
3. **Conservative HSTS**: Be extremely careful with HSTS enablement
4. **Regular Reviews**: Schedule periodic security header audits

## Additional Resources

- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [Mozilla CSP Guidelines](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google Web Fundamentals - Security](https://developers.google.com/web/fundamentals/security/)

---

**Last Updated**: August 24, 2025  
**Version**: 1.0  
**Status**: Production Ready