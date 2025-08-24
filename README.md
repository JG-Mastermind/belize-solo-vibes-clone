# BelizeVibes.com Tourism Platform

**Status**: 85% Complete - Production-Ready Platform  
**Tech Stack**: React 18 + TypeScript + Vite + Supabase + Stripe  
**Security**: Phase 2 Complete - Enterprise Security Infrastructure  

## Quick Start

```bash
# Development
npm install
npm run dev        # Frontend (localhost:5173)
npm run dev:server # Backend (Supabase local)

# Production Build
npm run build
npm run preview
```

## 🔒 Security

**Security Status**: ✅ Production-Ready Security Infrastructure  
**Last Security Audit**: August 24, 2025  
**Security Level**: Enterprise-Grade  

### Security Documentation
- **[Security Overview](docs/security/README.md)** - Complete security guide and best practices
- **[Incident Response](docs/security/playbooks/incident-response.md)** - Security incident procedures  
- **[Pre-Release Checklist](docs/security/checklists/pre-release.md)** - Deployment security validation
- **[Secure Coding Guidelines](docs/security/secure-coding.md)** - Development security patterns
- **[Security Headers Guide](docs/security/headers.md)** - Production header configuration
- **[Rate Limiting](docs/security/rate-limiting.md)** - DoS protection and configuration
- **[Real-time Monitoring](docs/security/real-time-monitoring.md)** - Security event monitoring

### Security Validation Commands
```bash
# Run complete security check
npm run security:preflight

# Individual security validations  
npm run security:headers    # Security headers check
npm run security:audit      # NPM vulnerability scan
npm run security:scan       # Secret detection scan
npm run security:test       # Security test suite
npm run security:monitor    # Security monitoring health
npm run security:quiz       # Security knowledge quiz
```

### Security Infrastructure
- ✅ **Security Headers**: CSP, HSTS-ready, X-Frame-Options, X-Content-Type-Options
- ✅ **Rate Limiting**: Edge Function DoS protection (Redis + Deno KV)  
- ✅ **Real-time Monitoring**: Security event logging and alerting
- ✅ **CI Security Pipeline**: 7-job automated security validation
- ✅ **Team Training**: Comprehensive security documentation and playbooks

### Emergency Security Contact
- **Security Team**: security@belizevibes.com
- **Incident Response**: See [incident-response.md](docs/security/playbooks/incident-response.md)

## Project Structure

```
├── docs/security/          # Security documentation and procedures
├── src/                    # React frontend application  
├── supabase/              # Database, Edge Functions, migrations
├── server/headers/        # Production security header templates
├── scripts/               # Security monitoring and validation tools
└── .github/workflows/     # CI/CD with integrated security pipeline
```

## Development Context

See [CLAUDE.md](CLAUDE.md) for complete project context and agent instructions.
