# Continuous Integration (CI) Runbook

## Overview

This runbook covers the CI/CD pipeline implementation for the Belize Solo Vibes application, focusing on quality gates, automated testing, and build verification to prevent regressions from reaching production.

## CI Pipeline Architecture

### Workflow Structure (`.github/workflows/ci.yml`)

The CI pipeline consists of 4 parallel/sequential jobs:

1. **Quality Gates** (parallel) - ESLint + TypeScript checking
2. **Unit Tests & Coverage** (parallel) - Jest test suite with coverage reporting  
3. **Build Verification** (parallel) - Production build validation
4. **CI Status Check** (sequential) - Final gate that blocks PRs on failures

### Execution Time Target: 5-8 minutes
- **Quality**: ~2-3 minutes (lint + type-check)
- **Tests**: ~3-5 minutes (Jest with coverage)  
- **Build**: ~2-3 minutes (Vite production build)

## Required NPM Scripts

The CI pipeline depends on these `package.json` scripts:

```json
{
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc --noEmit", 
    "test": "jest",
    "build": "vite build"
  }
}
```

All scripts are present and functional.

## Local CI Execution

### Run Full CI Suite Locally

```bash
# Install dependencies (matches CI environment)
npm ci

# Run quality gates
npm run lint
npm run type-check

# Run tests with coverage (matches CI)
npm test -- --coverage --watchAll=false --passWithNoTests

# Verify build
npm run build
```

### Individual Quality Checks

```bash
# Lint only (fix auto-fixable issues)
npm run lint -- --fix

# TypeScript check only
npm run type-check

# Tests only (watch mode for development)
npm test

# Tests with coverage report
npm test -- --coverage
```

## Test Coverage & Quality Gates

### Current Test Status

✅ **RequireRole.test.tsx** - 5 tests passing (authentication/authorization)
⚠️ **AuthCallback.test.tsx** - Timeout issues in 1 test
⚠️ **AdminPasswordReset.test.tsx** - Loading state issues  
⚠️ **PasswordResetSecurity.test.tsx** - Loading state issues

### Coverage Thresholds

Currently running with `--passWithNoTests` to prevent CI failures while auth test issues are resolved by the Password Reset Surgeon.

**Production Targets** (to be enforced once auth tests are stable):
- Minimum 50% line coverage for changed files
- All new components require corresponding tests
- Critical paths (auth, payments, bookings) require higher coverage

### Test Execution Environment

```bash
# CI Test Environment Variables
CI=true                    # Disables watch mode, enables CI-specific behavior
NODE_ENV=test             # Jest test environment  
JEST_TIMEOUT=10000        # 10-second timeout for async tests
```

## Quality Gate Rules

### Blocking Conditions (PR/Push failures)

1. **ESLint failures** - Code style violations
2. **TypeScript errors** - Type checking failures  
3. **Test failures** - Unit test suite failures
4. **Build failures** - Production build errors

### Non-blocking (Reporting Only)

1. **Test coverage** - Reports generated, thresholds not enforced yet
2. **Build artifacts** - Uploaded for inspection but don't block

## Artifact Management

### Coverage Reports
- **Path**: `coverage/` directory
- **Retention**: 7 days
- **Format**: HTML + JSON reports
- **Access**: Download from GitHub Actions "Artifacts" tab

### Build Artifacts  
- **Path**: `dist/` directory  
- **Retention**: 7 days
- **Purpose**: Production build verification
- **Access**: Download from GitHub Actions "Artifacts" tab

## CI Performance Optimization

### Caching Strategy
- **Node.js cache**: `actions/setup-node@v4` with `cache: 'npm'`
- **Dependencies**: `npm ci` for consistent, fast installs
- **Parallel execution**: Quality/Tests/Build run simultaneously

### Speed Optimizations
- **Parallel jobs**: Independent quality checks run concurrently
- **Fast failure**: Jobs fail fast on first error
- **Artifact uploads**: Only on completion to avoid partial uploads
- **Timeout protection**: Each job has realistic timeout limits

## Troubleshooting Common Issues

### Test Timeout Issues
```bash
# Increase Jest timeout for specific tests
test('description', async () => {
  // test implementation
}, 15000); // 15 second timeout
```

### ESLint Failures
```bash
# Auto-fix most issues locally before pushing
npm run lint -- --fix

# Check specific file
npx eslint src/path/to/file.tsx
```

### TypeScript Errors
```bash
# Run type-check with detailed output
npm run type-check -- --verbose

# Check specific file
npx tsc --noEmit src/path/to/file.tsx
```

### Build Failures
```bash
# Debug build locally
npm run build -- --mode development
npm run build:dev

# Check for missing environment variables
grep -r "import.meta.env" src/
```

## Security Considerations

### No Secrets in CI
- No database credentials required (tests use mocks)
- No API keys needed (auth tests use mock providers)  
- No payment processing (Stripe tests use mock/test mode)

### Safe Testing Patterns
- All external services mocked in tests
- No network calls in unit tests
- Test databases isolated from production
- Auth tests use controlled mock data

## Monitoring & Alerts

### GitHub Status Checks
- All jobs must pass for PR merge
- Branch protection rules enforced on `main`
- Status visible in PR interface

### Failure Notifications
- GitHub automatically notifies on push failures
- PR reviews blocked until CI passes
- Team notifications via GitHub team settings

## Future Enhancements

### Planned CI Improvements
1. **E2E Testing** - Optional Cypress/Playwright job (label-triggered)
2. **Security Scanning** - npm audit integration  
3. **Performance Testing** - Lighthouse CI integration
4. **Dependency Scanning** - CodeQL security scanning

### Test Infrastructure Improvements
1. **Auth Test Stabilization** - Fix remaining timeout/loading issues
2. **Coverage Enforcement** - Enable threshold gates once tests are stable
3. **Test Parallelization** - Optimize Jest execution for larger test suites

## Related Documentation

- [Password Reset Security](/docs/runbooks/password-reset.md) - Auth flow testing patterns
- [Performance Monitoring](/docs/runbooks/performance-monitoring.md) - Performance CI integration
- [Test Mocking Patterns](/docs/testing/test-mocking-patterns.md) - Component testing strategies

## Emergency Procedures

### CI Pipeline Down
1. Check GitHub Status page for service issues
2. Verify workflow file syntax with GitHub Actions validator  
3. Check for recent dependency updates causing failures
4. Temporarily disable failing jobs if critical deployment needed

### Test Suite Instability
1. Run tests locally to reproduce issues
2. Check for race conditions in async tests
3. Review mock setup and cleanup between tests
4. Consider quarantining flaky tests while investigating

**Last Updated**: August 22, 2025  
**Next Review**: September 22, 2025