# BelizeVibes Security Guide

**Project**: BelizeVibes.com Tourism Platform  
**Security Status**: Phase 2 Complete - Production-Ready Security Infrastructure  
**Last Updated**: August 24, 2025  

## 📋 Quick Reference

| Component | Status | Documentation | Validation |
|-----------|---------|--------------|------------|
| Security Headers | ✅ Ready | [headers.md](./headers.md) | `node scripts/check-security-headers.mjs` |
| Rate Limiting | ✅ Active | [rate-limiting.md](./rate-limiting.md) | `deno test supabase/functions/_tests/rateLimit.spec.ts` |
| Real-time Monitoring | ✅ Deployed | [real-time-monitoring.md](./real-time-monitoring.md) | `node scripts/security-watch.mjs` |
| Team Training | ✅ Complete | This document | [Security Quiz](#security-quiz) |

---

## 🔒 Security Fundamentals

### Secrets Hygiene Practices

**CRITICAL RULE**: **ZERO SECRETS IN REPOSITORY**

#### Environment Variables Management

**DO**:
```bash
# Use environment variables for all secrets
SUPABASE_ANON_KEY=your_key_here
STRIPE_PUBLIC_KEY=pk_live_...
OPENAI_API_KEY=sk-...

# Keep production secrets in deployment platform
# Use .env.local for development (gitignored)
```

**DON'T**:
```typescript
// NEVER hardcode secrets in source code
const supabaseUrl = "https://abc123.supabase.co"  // ❌ BAD
const stripeKey = "sk_live_abc123..."             // ❌ VERY BAD
```

#### Secret Rotation Policy

1. **Quarterly Rotation**: Database passwords, API keys, service tokens
2. **Immediate Rotation**: If any secret is potentially compromised
3. **Emergency Rotation**: Within 1 hour for production systems
4. **Documentation**: Update deployment guides with new configurations

### PR Security Gates & Checklists

Every pull request MUST pass these security checks:

#### Automated Security Pipeline (CI/CD)
```yaml
# .github/workflows/security.yml - 7 Mandatory Jobs
✅ npm-audit          # Dependency vulnerability scan (HIGH severity blocks)
✅ secret-scan        # TruffleHog credential detection
✅ codeql-analysis    # Static security analysis
✅ headers-check      # Security headers validation
✅ edge-function-tests # Rate limiting validation
✅ auth-security      # Authentication flow security
✅ monitor-smoke      # Security monitoring pipeline health
```

#### Manual Security Checklist
Before merging any PR, verify:

- [ ] **No hardcoded secrets** in diff (`git diff --name-only | xargs grep -l "api.*key\|secret\|password"`)
- [ ] **Rate limiting configured** for new endpoints in `supabase/functions/_rateLimit.config.json`
- [ ] **RLS policies enabled** for new database tables
- [ ] **Authentication checks** added for protected routes
- [ ] **Input validation** implemented for all user inputs
- [ ] **Error messages** don't leak sensitive information

### Security Headers & CSP Rollout

#### Development Headers (Immediate)
```typescript
// vite.config.ts - Development security headers
headers: {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block'
}
```

#### Production Rollout Procedure

**Phase 1: Report-Only Monitoring (Week 1-2)**
```nginx
# Enable CSP in report-only mode
Content-Security-Policy-Report-Only: default-src 'self' https://*.supabase.co https://*.stripe.com;
```

**Phase 2: Enforce CSP (Week 3)**  
```nginx
# Switch to enforcement after clean reports
Content-Security-Policy: default-src 'self' https://*.supabase.co https://*.stripe.com;
```

**Phase 3: Enable HSTS (Week 4)**
```nginx
# Enable HSTS for production (HTTPS only)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**Validation Commands**:
```bash
# Check development headers
node scripts/check-security-headers.mjs

# Check production deployment
curl -I https://belizevibes.com | grep -E "(X-Frame|Content-Security|Strict-Transport)"
```

### Database Security (RLS Do's & Don'ts)

#### Row Level Security (RLS) Best Practices

**DO**:
```sql
-- Enable RLS on ALL public tables
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Create explicit allow policies
CREATE POLICY "Public tours visible to all"
ON public.tours FOR SELECT
USING (is_published = true);

-- Pin search_path in SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION accept_admin_invitation(invitation_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
```

**DON'T**:
```sql
-- Never bypass RLS in application code
SET row_security = off;  -- ❌ DANGEROUS

-- Avoid overly broad policies
CREATE POLICY "Allow all" ON sensitive_table USING (true);  -- ❌ BAD

-- Don't use SECURITY DEFINER without search_path
CREATE FUNCTION risky_function() SECURITY DEFINER AS $$  -- ❌ SQL INJECTION RISK
```

#### Database Security Audit Checklist

Before any database changes:

- [ ] **RLS enabled** on all new public tables
- [ ] **Explicit policies** created (no implicit access)
- [ ] **search_path pinned** in SECURITY DEFINER functions  
- [ ] **Minimal privileges** granted to application roles
- [ ] **Audit logging** enabled for sensitive operations
- [ ] **Test policies** with different user roles

---

## 🚨 Critical Security Events

### Rate Limiting Violations

**Event Type**: `rate_limit_exceeded`  
**Monitoring**: Real-time via `scripts/security-watch.mjs`

**Alert Thresholds**:
- **10+ violations/minute from single IP**: Potential DoS attack
- **50+ violations/hour globally**: Review rate limits
- **Auth endpoint violations**: Brute force attempt

**Response Actions**:
1. Check security monitoring dashboard
2. Analyze attack patterns and source IPs
3. Adjust rate limits if legitimate traffic
4. Block IPs if confirmed attack

### CSP Violations

**Event Type**: `csp_violation`  
**Endpoint**: `/functions/v1/csp-report`

**Common Causes**:
- **Inline scripts**: Move to external files with nonces
- **3rd party resources**: Add to CSP allowlist
- **Browser extensions**: User-side, no action needed

### Authentication Anomalies

**Event Type**: `auth_anomaly`  
**High Priority Indicators**:
- Multiple failed admin logins
- Session hijacking attempts
- Role escalation attempts

---

## 🛠️ Security Tools & Commands

### Real-Time Security Monitoring

```bash
# Monitor all security events
node scripts/security-watch.mjs

# Filter by event type
node scripts/security-watch.mjs --type=rate_limit_exceeded

# Monitor last 24 hours
node scripts/security-watch.mjs --last=24h

# Export security report
node scripts/security-watch.mjs --export=security-report-$(date +%Y%m%d).json
```

### Security Validation Commands

```bash
# Full security check
npm run security:check

# Individual validations
npm run security:headers     # Check development headers
npm run security:audit       # NPM audit with high severity
npm run security:scan        # Secret scanning with TruffleHog
npm run security:test        # Run security test suite

# Security documentation
npm run security:docs        # Validate documentation links
npm run security:quiz        # Run security knowledge quiz
```

### Emergency Response Commands

```bash
# Disable rate limiting (emergency only)
export RATE_LIMIT_ENABLED=false
pm2 restart all

# Check recent security events
node scripts/security-watch.mjs --last=1h --severity=critical

# Export incident data
node scripts/security-watch.mjs --export=incident-$(date +%Y%m%d-%H%M).json
```

---

## 📊 Security Metrics & KPIs

### Security Health Dashboard

| Metric | Target | Current | Status |
|--------|---------|---------|--------|
| Security Events/Day | < 100 | 45 | ✅ Green |
| Rate Limit Violations | < 50/hour | 12 | ✅ Green |
| CSP Violations | < 10/day | 3 | ✅ Green |
| Failed Auth Attempts | < 25/hour | 8 | ✅ Green |
| Critical Vulnerabilities | 0 | 0 | ✅ Green |

### Weekly Security Review

Every Monday, check:
- [ ] Security events dashboard for anomalies
- [ ] Rate limiting effectiveness and false positives
- [ ] CSP violation patterns and necessary allowlist updates
- [ ] Failed authentication patterns and geographic distribution
- [ ] NPM audit results and dependency updates needed

---

## 🎓 Security Training

### Security Quiz

Test your security knowledge:
```bash
npm run security:quiz
```

### Key Learning Areas

1. **Secrets Management**: Environment variables, rotation policies
2. **Authentication Security**: JWT validation, role enforcement
3. **Input Validation**: SQL injection, XSS prevention
4. **Rate Limiting**: DoS protection, threshold tuning  
5. **Database Security**: RLS policies, SECURITY DEFINER functions
6. **Incident Response**: Detection, containment, recovery

### Required Reading

- [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## 📞 Emergency Contacts

### Security Incident Response Team

**Primary Escalation**:
- **CTO**: [Contact Information]
- **Lead Developer**: [Contact Information]
- **Security Team**: security@belizevibes.com

**Severity Levels**:
- **P0 Critical**: Active security breach, data exposure
- **P1 High**: Authentication system compromise, DoS attack
- **P2 Medium**: Suspicious activity, failed rate limiting
- **P3 Low**: Policy violations, monitoring alerts

### External Resources

- **Supabase Support**: support@supabase.com
- **Stripe Security**: security@stripe.com
- **Cloud Provider**: [Your hosting provider security team]

---

## 🔗 Related Documentation

- **[Incident Response Playbook](./playbooks/incident-response.md)**: Step-by-step incident handling
- **[Pre-Release Security Checklist](./checklists/pre-release.md)**: Deployment security validation
- **[Secure Coding Guidelines](./secure-coding.md)**: Development security patterns
- **[Security Headers Guide](./headers.md)**: Production header configuration
- **[Rate Limiting Documentation](./rate-limiting.md)**: DoS protection setup
- **[Real-time Monitoring](./real-time-monitoring.md)**: Security event monitoring

---

*This document is maintained by the BelizeVibes Security Team. Last review: August 24, 2025*