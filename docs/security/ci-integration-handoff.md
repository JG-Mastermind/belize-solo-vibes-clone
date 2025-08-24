# CI-CD Butler Integration Handoff: Security Headers

## Request for CI-CD Butler

Please enhance the basic security workflow I've created at `/.github/workflows/security.yml` with the following additions:

### Current State
- Basic security headers validation job exists
- Uses `node scripts/check-security-headers.mjs --ci` 
- Runs on push to main/develop and PRs to main

### Enhancement Requests

#### 1. Add npm audit job
```yaml
  audit-check:
    name: NPM Security Audit
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm audit --audit-level=high
```

#### 2. Add secret scanning job
```yaml
  secret-scan:
    name: Secret Detection Scan
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run secret detection
      run: |
        # Add your preferred secret scanning approach here
        echo "Secret scanning placeholder - implement with your preferred tool"
```

#### 3. Add CodeQL analysis (optional)
Consider adding GitHub's CodeQL for static analysis if appropriate for the security workflow.

### Integration Notes
- The header validation script returns proper exit codes (0 = pass, 1 = critical issues, 2 = missing templates)
- All security checks should block deployment if they fail
- The workflow should run the headers check I've provided as the foundation

### Files Ready for Integration
- `/scripts/check-security-headers.mjs` - Full validation script with CI support
- `/.github/workflows/security.yml` - Basic workflow ready for enhancement
- `/docs/security/headers.md` - Complete documentation for reference

Please expand this security workflow with your expertise in CI/CD pipeline design while keeping the headers check as the core component.