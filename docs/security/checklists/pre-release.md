# Pre-Release Security Checklist

**Project**: BelizeVibes.com Tourism Platform  
**Version**: 1.0  
**Last Updated**: August 24, 2025  
**Purpose**: Ensure comprehensive security validation before production deployment

---

## 📋 Quick Validation Commands

Run these commands before any production deployment:

```bash
# Complete security validation suite
npm run security:preflight

# Individual component checks
npm run security:headers        # Security headers validation
npm run security:audit         # NPM vulnerability scan
npm run security:scan          # Secret detection scan
npm run security:test          # Security test suite
npm run security:monitor       # Security monitoring health check
```

---

## 🔐 Environment & Secrets Validation

### Environment Configuration Checklist

#### Production Environment Variables
- [ ] **SUPABASE_URL**: Production Supabase project URL (not staging)
- [ ] **SUPABASE_ANON_KEY**: Production anonymous key (rotated within 90 days)
- [ ] **SUPABASE_SERVICE_ROLE_KEY**: Service role key (restricted to server)
- [ ] **STRIPE_PUBLIC_KEY**: Production publishable key (pk_live_...)
- [ ] **STRIPE_SECRET_KEY**: Production secret key (sk_live_...) - server only
- [ ] **OPENAI_API_KEY**: Production API key (if using AI features)

#### Secrets Hygiene Validation
```bash
# Scan repository for exposed secrets
npm run security:scan

# Verify no secrets in environment files committed to git
git log --all --grep="key\|secret\|password" --oneline | head -20

# Check .env files are properly gitignored
git check-ignore .env .env.local .env.production || echo "WARNING: .env files not ignored"

# Validate environment variables in deployment
echo "Checking critical environment variables..."
[[ -n "$SUPABASE_URL" ]] && echo "✅ SUPABASE_URL set" || echo "❌ SUPABASE_URL missing"
[[ -n "$STRIPE_PUBLIC_KEY" ]] && echo "✅ STRIPE_PUBLIC_KEY set" || echo "❌ STRIPE_PUBLIC_KEY missing"
```

#### Secret Rotation Validation
- [ ] **Database passwords**: Rotated within last 90 days
- [ ] **API keys**: Rotated within last 90 days  
- [ ] **JWT secrets**: Rotated within last 90 days
- [ ] **Webhook secrets**: Current and verified with third parties

---

## 🛡️ Security Headers Verification

### Development Headers Check
```bash
# Verify security headers in vite.config.ts
node scripts/check-security-headers.mjs
```

**Required Headers in Development**:
- [ ] **X-Frame-Options**: DENY
- [ ] **X-Content-Type-Options**: nosniff
- [ ] **Referrer-Policy**: strict-origin-when-cross-origin  
- [ ] **X-XSS-Protection**: 1; mode=block

### Production Server Configuration

#### Nginx Deployment
- [ ] **Server config**: `server/headers/nginx.conf` applied to production
- [ ] **CSP Policy**: Content-Security-Policy configured with proper allowlists
- [ ] **HSTS Ready**: Strict-Transport-Security configuration prepared (disabled initially)
- [ ] **Permissions Policy**: Minimal permissions for geolocation/camera/microphone

#### Apache Deployment  
- [ ] **htaccess file**: `server/headers/apache.htaccess` uploaded to document root
- [ ] **mod_headers enabled**: Apache module loaded and active
- [ ] **CSP Report-Only**: Initial deployment in report-only mode

### Security Headers Validation Commands
```bash
# Check production headers after deployment
curl -I https://belizevibes.com | grep -E "(X-Frame|Content-Security|X-Content-Type)"

# Verify CSP policy syntax
curl -H "User-Agent: BelizeVibes-Security-Check" https://belizevibes.com 2>/dev/null | grep -i "content-security-policy"

# Test CSP violation reporting endpoint
curl -X POST https://belizevibes.com/functions/v1/csp-report \
  -H "Content-Type: application/csp-report" \
  -d '{"csp-report":{"document-uri":"https://test.com","blocked-uri":"evil.com","violated-directive":"script-src"}}'
```

---

## 🔒 Application Controls Validation

### Rate Limiting Configuration

#### Edge Function Rate Limiting
- [ ] **Middleware active**: `supabase/functions/_middleware.ts` deployed
- [ ] **Configuration file**: `_rateLimit.config.json` with all endpoints configured
- [ ] **Redis connection**: Upstash Redis credentials configured and tested
- [ ] **Fallback storage**: Deno KV available as backup rate limiting store

#### Rate Limiting Test Commands
```bash
# Test rate limiting functionality
deno test supabase/functions/_tests/rateLimit.spec.ts --allow-net --allow-env --allow-read

# Test specific endpoint rate limits (replace with actual endpoint)
for i in {1..15}; do curl -w "%{http_code}\n" -o /dev/null -s https://belizevibes.com/functions/v1/test-auth; done

# Monitor rate limiting violations
node scripts/security-watch.mjs --type=rate_limit_exceeded --last=10m
```

#### Critical Endpoint Protection Verification
- [ ] **Authentication**: `/functions/v1/test-auth` - 10 requests/minute
- [ ] **Admin functions**: `/functions/v1/create-admin-user` - 3 requests/5 minutes
- [ ] **Payment processing**: Stripe webhook endpoints - 15-30 requests/minute  
- [ ] **Password reset**: Auth recovery flows - 5 requests/10 minutes
- [ ] **Public APIs**: Tours, content endpoints - 60-300 requests/minute

### Authentication Flow Security

#### Admin Authentication
```bash
# Test admin login security
curl -X POST https://belizevibes.com/auth/v1/token \
  -H "Content-Type: application/json" \
  -d '{"email":"test@invalid.com","password":"wrongpassword"}'

# Verify failed login attempts are logged
node scripts/security-watch.mjs --type=auth_anomaly --last=5m
```

#### Password Reset Security
- [ ] **No auto-login**: Recovery URLs don't automatically create sessions
- [ ] **Single use**: Recovery tokens expire after one use
- [ ] **Explicit form**: Users must enter new password via form
- [ ] **Session cleanup**: Old sessions invalidated after password change
- [ ] **Rate limited**: Password reset requests properly rate limited

#### Role-Based Access Control
```bash
# Test unauthorized admin access
curl -H "Authorization: Bearer invalid_token" https://belizevibes.com/dashboard/admin

# Verify super admin restrictions
# (This should be done with valid test accounts, not production)
```

---

## 🗄️ Database Security Validation

### Row Level Security (RLS) Verification

#### RLS Policy Audit
```sql
-- Verify RLS is enabled on all public tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = false;
-- Should return no rows for production deployment

-- Check for tables without explicit policies
SELECT t.tablename
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename
WHERE t.schemaname = 'public' AND p.policyname IS NULL;
-- Review any results for security implications
```

#### RLS Policy Testing Commands
```bash
# Test RLS policies with different user roles
npm run test:rls-policies

# Verify unauthorized access is properly denied
npm run test:unauthorized-access
```

### SECURITY DEFINER Function Audit

#### Function Security Review
```sql
-- List all SECURITY DEFINER functions
SELECT routine_name, routine_type, security_type, routine_definition
FROM information_schema.routines 
WHERE security_type = 'DEFINER' AND routine_schema = 'public';

-- Verify search_path is set in SECURITY DEFINER functions
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE security_type = 'DEFINER' 
  AND routine_schema = 'public'
  AND routine_definition NOT LIKE '%SET search_path%';
-- Should return no rows - all SECURITY DEFINER functions must pin search_path
```

### Database Migration Integrity
```bash
# Verify migration consistency
supabase db diff --remote

# Check for migration conflicts
supabase status

# Validate migration up/down cycles work
supabase db reset --local
supabase db push --local
```

---

## 📊 Security Monitoring Validation

### Real-Time Security Monitoring

#### Security Events Pipeline Test
```bash
# Verify security events are being logged
node scripts/security-watch.mjs --last=1h | head -20

# Test security event creation
curl -X POST https://belizevibes.com/functions/v1/csp-report \
  -H "Content-Type: application/csp-report" \
  -d '{"csp-report":{"document-uri":"https://test.com","blocked-uri":"evil.com","violated-directive":"test"}}'

# Verify event was logged
node scripts/security-watch.mjs --type=csp_violation --last=5m
```

#### Monitoring Dashboard Health
- [ ] **Security events table**: Accessible and receiving data
- [ ] **RLS policies**: Properly restrict access to security events
- [ ] **Event retention**: 90-day cleanup job configured and working
- [ ] **Alert thresholds**: Configured for each event type

### CI Security Pipeline Validation

#### GitHub Actions Security Workflow
- [ ] **npm-audit**: Running and catching high/critical vulnerabilities
- [ ] **secret-scan**: TruffleHog scanning for exposed credentials
- [ ] **codeql-analysis**: Static security analysis completing
- [ ] **headers-check**: Security headers validation passing
- [ ] **edge-function-tests**: Rate limiting tests executing
- [ ] **auth-security**: Authentication security tests passing
- [ ] **monitor-smoke**: Security monitoring pipeline health check

```bash
# Trigger security workflow manually
gh workflow run security.yml

# Check latest security workflow status
gh run list --workflow=security.yml --limit=1
```

---

## 🔍 Vulnerability Assessment

### Dependency Security Audit

#### NPM Security Audit
```bash
# Run comprehensive npm audit
npm audit --audit-level=moderate

# Check for critical/high vulnerabilities (deployment blockers)
npm audit --audit-level=high

# Generate security report
npm audit --json > security-audit-$(date +%Y%m%d).json
```

#### Dependency Updates Verification
- [ ] **Critical security patches**: All high/critical vulnerabilities patched
- [ ] **Production dependencies**: Only essential packages in production build
- [ ] **Development dependencies**: Security vulnerabilities in devDependencies reviewed
- [ ] **Package lock**: package-lock.json includes integrity hashes

### Security Testing Suite

#### Authentication Security Tests
```bash
# Run authentication security test suite
npm run test:auth-security

# Test password reset security (should not auto-login)
npm run test:password-reset-security

# Test role-based access control
npm run test:rbac-security
```

#### Input Validation Tests
```bash
# Test SQL injection prevention
npm run test:sql-injection

# Test XSS prevention  
npm run test:xss-prevention

# Test CSRF protection
npm run test:csrf-protection
```

---

## 🚀 Deployment Readiness Checklist

### Pre-Deployment Final Checks

#### Code Quality & Security
- [ ] **All tests passing**: `npm test` returns exit code 0
- [ ] **Build successful**: `npm run build` completes without errors
- [ ] **TypeScript check**: `tsc --noEmit` passes
- [ ] **Linting**: `npm run lint` passes with zero security-related errors
- [ ] **Security audit**: `npm audit --audit-level=high` clean

#### Production Configuration
- [ ] **Environment variables**: All production secrets configured in deployment platform
- [ ] **Server configuration**: Security headers configuration deployed
- [ ] **CDN/WAF**: Firewall rules and DDoS protection configured
- [ ] **SSL certificates**: Valid certificates installed and auto-renewal configured
- [ ] **DNS security**: DNSSEC enabled, CAA records configured

#### Database Deployment
- [ ] **Migration review**: All migrations reviewed for security implications
- [ ] **RLS policies**: All public tables have appropriate row-level security
- [ ] **User permissions**: Database user permissions follow principle of least privilege
- [ ] **Backup verification**: Recent backup exists and restore procedure tested

#### Monitoring & Alerting
- [ ] **Security monitoring**: Real-time security event monitoring active
- [ ] **Alert thresholds**: Configured for rate limiting, CSP violations, auth anomalies
- [ ] **Incident response**: Team notified of deployment and incident procedures reviewed
- [ ] **Health checks**: Application and security monitoring health checks configured

### Post-Deployment Validation

#### Immediate Post-Deployment (0-15 minutes)
```bash
# Verify site accessibility
curl -I https://belizevibes.com

# Check security headers
curl -I https://belizevibes.com | grep -E "(X-Frame|Content-Security|X-Content-Type)"

# Test authentication flow
curl -X GET https://belizevibes.com/dashboard  # Should require authentication

# Monitor for any immediate security events
node scripts/security-watch.mjs --last=15m --severity=critical
```

#### Extended Validation (15-60 minutes)
- [ ] **Authentication flows**: Login/logout working correctly
- [ ] **Payment processing**: Test transactions processing without errors
- [ ] **Rate limiting**: Verify rate limits are active and not blocking legitimate traffic
- [ ] **CSP violations**: Monitor for unexpected CSP violations
- [ ] **Error rates**: Check application error rates are within normal bounds

---

## 📈 Security Metrics Baseline

### Key Security Indicators (KSI)

Record these baseline metrics immediately after deployment:

| Metric | Target | Baseline | Status |
|--------|---------|----------|--------|
| Security Events/Hour | < 10 | __ | __ |
| Rate Limit Violations/Hour | < 5 | __ | __ |
| CSP Violations/Hour | < 2 | __ | __ |
| Failed Auth Attempts/Hour | < 25 | __ | __ |
| P0 Security Incidents | 0 | __ | __ |

### Monitoring Setup
```bash
# Set up baseline monitoring
node scripts/security-watch.mjs --baseline --export=baseline-$(date +%Y%m%d).json

# Schedule regular security reports
echo "0 9 * * 1 cd /app && node scripts/security-watch.mjs --report=weekly" | crontab
```

---

## 🚨 Rollback Procedures

### Emergency Rollback Triggers

**Immediate rollback required if**:
- [ ] **Authentication system failure**: Users cannot log in
- [ ] **Payment processing failure**: Transactions failing at >5% rate
- [ ] **Security breach detected**: Active attack in progress
- [ ] **Critical performance degradation**: >50% increase in response times
- [ ] **Database connection issues**: Application cannot connect to database

### Rollback Commands
```bash
# Application rollback (if using blue-green deployment)
kubectl patch service belize-app -p '{"spec":{"selector":{"version":"previous"}}}'

# Database rollback (EXTREME CAUTION - DATA LOSS POSSIBLE)
supabase db reset --remote  # Only if database corruption detected

# CDN rollback (revert security headers)
curl -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/security_header" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_API_KEY" \
  -d '{"value":"off"}'

# Rate limiting disable (emergency only)
export RATE_LIMIT_ENABLED=false
kubectl set env deployment/belize-app RATE_LIMIT_ENABLED=false
```

---

## ✅ Sign-off Requirements

### Technical Sign-off
- [ ] **Security Lead**: Security validation completed ________________________
- [ ] **Lead Developer**: Code review and testing completed __________________
- [ ] **DevOps Engineer**: Infrastructure and monitoring ready ________________

### Business Sign-off  
- [ ] **CTO**: Overall deployment approval ________________________________
- [ ] **Product Owner**: Feature readiness confirmed _______________________
- [ ] **Support Manager**: Support documentation updated ____________________

### Compliance Sign-off (if applicable)
- [ ] **Legal**: Privacy and compliance requirements met ____________________
- [ ] **Data Protection Officer**: Data handling procedures verified ___________

---

**Deployment Authorized By**: _________________________ **Date**: ___________

**Next Security Review**: _________________________ (30 days post-deployment)

---

*This checklist should be completed for every production deployment. Keep completed checklists for audit purposes and continuous improvement of the deployment process.*