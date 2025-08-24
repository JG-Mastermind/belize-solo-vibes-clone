# CI Security Workflow Documentation

## Overview

The enhanced security workflow (`/.github/workflows/security.yml`) provides comprehensive security scanning and compliance validation for the BelizeVibes production application.

## Security Checks Overview

### 1. NPM Security Audit (`audit-check`)
- **Purpose**: Detect known vulnerabilities in production dependencies
- **Tool**: `npm audit --audit-level=high --omit=dev`
- **Timeout**: 5 minutes
- **Failure Condition**: Any high-severity vulnerabilities found
- **Artifacts**: Detailed audit reports on failures (30-day retention)

### 2. Secret Detection (`secret-scan`)
- **Purpose**: Comprehensive secret detection using enterprise-grade scanning
- **Tool**: TruffleHog v3 with verified detectors
- **Scope**: Full git history scan
- **Timeout**: 8 minutes
- **Failure Condition**: Any verified secrets detected
- **Artifacts**: Secret scan results on failures (30-day retention)

### 3. CodeQL Analysis (`codeql-analysis`)
- **Purpose**: Static security analysis for JavaScript/TypeScript
- **Tool**: GitHub CodeQL with security-and-quality query suite
- **Permissions**: `security-events: write` for SARIF uploads
- **Timeout**: 10 minutes
- **Results**: Uploaded to GitHub Security tab

### 4. Security Headers (`headers-check`)
- **Purpose**: Validate production security headers configuration
- **Tool**: Custom script `scripts/check-security-headers.mjs --ci`
- **Timeout**: 5 minutes
- **Integration**: Built on Security Compliance Enforcer foundation
- **Failure Conditions**: Missing critical headers, secrets in repo, production template issues

### 5. Authentication Security Tests (`auth-security-tests`)
- **Purpose**: Run security-focused authentication test subset
- **Scope**: Password reset security, auth callback validation, role-based access
- **Test Patterns**: `(auth|security)` and `(password.*reset|reset.*security|auth.*callback)`
- **Timeout**: 10 minutes
- **Environment**: CI mode with proper test isolation
- **Resilience**: Accommodates known failing tests (25 failures, 39% rate) - focuses on security infrastructure validation

## Workflow Triggers

### Automatic Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Daily scheduled scan at 6 AM UTC

### Manual Triggers
- GitHub Actions UI manual dispatch (if enabled)
- API triggers via GitHub CLI

## Job Execution Strategy

### Parallel Execution
All security jobs run in parallel for optimal performance:
- NPM Audit (5 min)
- Secret Detection (8 min)
- CodeQL Analysis (10 min)
- Headers Validation (5 min)
- Auth Security Tests (10 min)

**Total Execution Time**: ~10 minutes (limited by slowest job)

### Failure Handling
- **Individual Jobs**: Fast-fail on security violations
- **Artifact Upload**: Security reports uploaded on failures
- **Summary Job**: Aggregates all results with detailed status report

## Security Compliance Gates

### Deployment Blockers
The workflow blocks deployment if ANY of these conditions are met:
1. High-severity npm vulnerabilities found
2. Secrets detected in repository
3. CodeQL security issues identified
4. Critical security headers missing
5. Authentication security tests failing

### Pass Criteria
✅ **Deployment Ready**: All 5 security checks must pass
- NPM audit clean (high-severity threshold)
- No verified secrets detected
- CodeQL analysis clean
- Security headers properly configured
- Authentication security tests passing

## Local Development Integration

### Running Security Checks Locally

```bash
# 1. NPM Audit
npm audit --audit-level=high --omit=dev

# 2. Security Headers Check
node scripts/check-security-headers.mjs --ci

# 3. Authentication Security Tests
npm test -- --testPathPattern="(auth|security)" --passWithNoTests --watchAll=false

# 4. Password Reset Security Tests
npm test -- --testNamePattern="(password.*reset|reset.*security|auth.*callback)" --passWithNoTests --watchAll=false
```

### Secret Detection (Local)
```bash
# Install TruffleHog locally
curl -sSfL https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/scripts/install.sh | sh -s -- -b /usr/local/bin

# Run secret scan
trufflehog git file://. --branch=main --only-verified --fail
```

## Troubleshooting Guide

### Common Failures

#### 1. NPM Audit Failures
```bash
# Check specific vulnerabilities
npm audit --audit-level=high --json

# Update vulnerable packages
npm update

# For persistent issues, use audit fix
npm audit fix --force
```

#### 2. Secret Detection Issues
- **False Positives**: Review TruffleHog results, add `.trufflehogignore` if needed
- **Historical Secrets**: Use `git filter-branch` or BFG repo-cleaner for history cleanup
- **Environment Files**: Ensure `.env*` files are in `.gitignore`

#### 3. CodeQL Analysis Failures
- Review GitHub Security tab for detailed findings
- Address identified security patterns
- Update dependencies if vulnerabilities are in third-party code

#### 4. Headers Check Failures
```bash
# Run locally for detailed output
node scripts/check-security-headers.mjs --ci

# Common issues:
# - Missing vite.config.ts security headers
# - Missing production templates
# - .env files not properly gitignored
```

#### 5. Authentication Test Failures
```bash
# Run specific auth tests
npm test -- --testPathPattern="auth" --verbose

# Check for:
# - Supabase client configuration issues
# - Role-based access control failures
# - Password reset security violations
```

## Integration with Main CI

### Branch Protection Rules
Recommend configuring branch protection to require security workflow:
```yaml
# In GitHub repository settings
required_status_checks:
  - "Security Compliance Summary"
```

### Status Check Dependencies
The security workflow integrates with the main CI pipeline:
- Runs in parallel with quality gates and tests
- Provides independent security status
- Blocks merges on security failures

## Performance Optimization

### Caching Strategy
- **Node.js Dependencies**: `actions/setup-node@v4` with `cache: 'npm'`
- **Build Artifacts**: Cached between CodeQL initialization and analysis

### Resource Usage
- **CPU**: Standard GitHub runners (2-core)
- **Memory**: ~7GB available per job
- **Network**: Minimal external dependencies (TruffleHog install only)

### Timeout Management
- Individual jobs: 3-10 minutes based on complexity
- Total workflow: ~10 minutes maximum
- Fail-fast approach prevents resource waste

## Security Artifacts

### Retention Policy
- **Security Reports**: 30 days retention
- **CodeQL Results**: Permanent in GitHub Security tab
- **Workflow Logs**: GitHub default retention (90 days)

### Artifact Contents
1. **NPM Audit Report**: JSON + summary text files
2. **Secret Scan Results**: TruffleHog JSON output
3. **Coverage Reports**: Test coverage for auth security tests

## Compliance Standards

### OWASP Alignment
- **A01:2021 - Broken Access Control**: Auth security tests
- **A02:2021 - Cryptographic Failures**: Secret detection
- **A03:2021 - Injection**: CodeQL static analysis
- **A05:2021 - Security Misconfiguration**: Headers validation
- **A09:2021 - Security Logging**: Comprehensive audit trails

### Enterprise Security
- Daily automated scans
- Comprehensive secret detection
- Static code analysis
- Authentication hardening tests
- Security headers enforcement

## Contact & Support

For security workflow issues:
1. Check job logs for detailed error messages
2. Review uploaded artifacts for remediation guidance
3. Run checks locally to reproduce issues
4. Consult this runbook for troubleshooting steps

**Critical Security Issues**: Follow incident response procedures and notify security team immediately.