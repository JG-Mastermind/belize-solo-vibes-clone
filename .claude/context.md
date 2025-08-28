# 📘 Claude Context Instructions for BelizeVibes
_Last updated: 2025-08-24 - PHASE 2 SECURITY HARDENING COMPLETE_

---

## 🚨 PROJECT STATUS - CRITICAL REGRESSIONS BLOCKING DEPLOYMENT
**Project Maturity:** 70% Complete - MAJOR FUNCTIONALITY FAILURES ⚠️  
**Status:** Production deployment BLOCKED due to critical feature regressions  
**Architecture:** Mature, interconnected system with established patterns  
**Database:** Real users and business logic in production environment
**Critical Issues:** Blog edit broken, French slugs failing, adventure creation non-functional, rich editor 60% operational

---

## 🧠 Project Overview
**Project Name:** BelizeVibes.com - Enterprise Tourism Platform  
**Scale:** 234 TypeScript/TSX files, 51,639+ lines of code, 27 SQL migrations  
**Architecture:** React 18 + TypeScript + Supabase + Stripe + AI Integration  
**Security:** Enterprise-grade monitoring, CSP headers, RLS policies, audit trails

**Key Systems:**
- ✅ **Multi-role Authentication:** Admin, Guide, Traveler with invitation-based management
- ✅ **Complete Booking Flow:** 5-step booking with Stripe integration
- ✅ **AI-Powered Content:** DALL-E 3 blog image generation with fallbacks  
- ✅ **Bilingual Support:** English/French with URL-based routing
- ✅ **Security Monitoring:** Real-time threat detection and incident response
- ✅ **Admin Portal:** Invitation management, user roles, audit trails

---

## 🧩 Claude's Development Role
**CRITICAL:** This is a **PRODUCTION SYSTEM** - Surgical changes only, NO experiments

### ✅ Authorized Actions:
- **Component Updates:** UI enhancements, bug fixes, performance optimizations
- **Security Fixes:** Vulnerability patches, header updates, RLS policy fixes
- **Feature Additions:** Small features using existing patterns
- **Documentation:** Updates to guides, runbooks, security docs
- **Testing:** Unit tests, integration tests, security test additions

### ❌ REQUIRE EXPLICIT APPROVAL:
- **Database Schema Changes:** Migrations, table modifications, RLS changes
- **Authentication Flow:** Role system, permission changes, auth callbacks
- **Payment System:** Stripe integration, webhook handlers, transaction logic
- **Translation System:** i18n routing, slug mapping, language detection
- **Major Refactoring:** Architectural changes, dependency updates

### 🛡️ CRITICAL BOUNDARIES:
- **High-Risk Areas:** Database/RLS, Auth flows, Payment processing, i18n routing
- **Production Impact:** Every change affects real users and business operations
- **Interconnected System:** Changes ripple through multiple components

---

## 🏗️ Enhanced Project Structure (Current)
```
/src (234 files)
  /components (95+ components)
    /ui/           # 44 shadcn/ui components
    /auth/         # 6 auth components + RequireRole HOC
    /booking/      # 8 booking flow components  
    /dashboard/    # 7 analytics dashboard components
    /admin/        # 3 admin portal components (NEW)
    /blog/         # 2 blog components + AI integration (NEW)
  /pages (55 pages)
    /admin/        # Enterprise admin portal (NEW)
    /dashboard/    # Role-based dashboards (admin/guide/traveler)
    /booking/      # Complete booking flow
    /auth/         # Authentication callbacks
  /services (6 services)
    aiImageService.ts        # DALL-E 3 integration (NEW)
    translationService.ts    # Enhanced i18n utilities
  /utils (12+ utilities)  
    blogAnalytics.ts        # User engagement tracking (NEW)
    blogImageUtils.ts       # Smart image selection (NEW)
    translations.ts         # Shared i18n utilities (NEW)
  /__tests__ (Testing framework - NEW)
    invitation.test.ts      # Admin system tests (205 lines)
    auth/__tests__/         # Authentication tests (149 lines)

/supabase
  /functions (5 Edge Functions)
    create_admin_invite/    # Secure invitation creation (NEW)
    revoke_admin_invite/    # Invitation revocation (NEW)
    _middleware.ts          # Rate limiting + security events (ENHANCED)
    _utils/                 # Security utilities (NEW)
  /migrations (27 files)
    *_security_events_monitoring.sql  # Real-time security monitoring (NEW)
    *_admin_invitations.sql           # Admin invitation system (NEW)
    
/docs
  /security (Complete security documentation - NEW)
    README.md, playbooks/, checklists/, secure-coding.md

/scripts
  security-watch.mjs      # Real-time security monitoring CLI (NEW)
  security-quiz.mjs       # Team training quiz (NEW)
```

---

## 🔒 ENHANCED SECURITY BOUNDARIES

### **Database (EXTREME CAUTION):**
- **27 Migrations:** Complex interdependencies, production data
- **RLS Policies:** Row-level security protecting user data
- **SECURITY DEFINER Functions:** Critical security functions requiring validation
- **Real-time Monitoring:** Security events table with automated alerting

### **Authentication System:**
- **Multi-role System:** super_admin, admin, blogger, guide, traveler roles
- **Invitation Management:** Crypto-secure codes, 48-hour expiry, audit trails  
- **Route Protection:** RequireRole HOC with comprehensive access control
- **Edge Functions:** Server-side security validation and role elevation

### **Payment Processing:**
- **Stripe Integration:** Live payment processing, webhook handlers
- **Security Monitoring:** Transaction monitoring, fraud detection alerts
- **Rate Limiting:** Payment endpoint protection against abuse

### **AI Integration:**
- **OpenAI DALL-E 3:** Live API integration with usage monitoring
- **Content Generation:** Blog image generation with content moderation
- **Graceful Degradation:** Smart fallbacks when AI services unavailable

---

## 🧪 PRODUCTION TESTING REQUIREMENTS

### **Required Before ANY Commit:**
```bash
# 1. Build validation
npm run build

# 2. Type checking  
npm run type-check

# 3. Linting
npm run lint

# 4. Security validation
npm run security:quiz

# 5. Test suite (if changes affect tested components)
npm test
```

### **Security-Critical Changes Require:**
- **Database Changes:** Migration dry-run, RLS policy validation
- **Auth Changes:** Complete auth flow testing, role verification
- **Payment Changes:** Stripe test mode validation, webhook testing

---

## 🚀 SESSION INITIALIZATION (MANDATORY)

### **Bootstrap Sequence:**
```bash
# 1. Load local context (NEVER commit .claude/)
read .claude/context.md && read .claude/session.md

# 2. Read master project instructions for full context
read CLAUDE.md

# 3. Review recent changes and project status
read CHANGELOG.md

# 4. Load specialized agents (9 available)
# Match task scope to appropriate agent before work

# 5. Git status check
git status && git log --oneline -3
```

### **Multi-Agent Task Routing:**
- **Security Tasks:** security-compliance-enforcer
- **Database/RLS:** backend-architecture-guardian  
- **i18n/SEO:** i18n-route-seo-agent
- **CI/CD:** ci-cd-butler
- **Complex Tasks:** general-purpose agent

---

## 📊 CURRENT CAPABILITIES & ACHIEVEMENTS

### **✅ Enterprise Features Operational:**
- **Real-time Security Monitoring:** Threat detection, automated alerting
- **Admin Invitation System:** Role-based onboarding with audit trails
- **AI Blog Generation:** DALL-E 3 integration with smart fallbacks
- **Comprehensive Testing:** Jest framework with component/integration tests
- **Bilingual Platform:** English/French with URL routing
- **Payment Processing:** Complete Stripe integration with security monitoring

### **✅ Security Infrastructure Complete:**
- **Rate Limiting:** DoS protection with progressive backoff
- **CSP Headers:** XSS prevention with violation reporting  
- **RLS Policies:** Database-level access control
- **Security Events:** Real-time monitoring and incident response
- **Team Training:** Security quiz and playbook system

### **🎯 System Health Metrics:**
- **Code Quality:** 234 TypeScript files, 51,639+ lines
- **Security:** 90% hardening complete, real-time monitoring operational
- **Performance:** 791KB main bundle (within acceptable limits)
- **Testing:** Comprehensive framework with critical path coverage

---

## 🎯 DEVELOPMENT PRIORITIES

### **IMMEDIATE (Next Session):**
- Small bug fixes and UI enhancements using existing patterns
- Security documentation updates and team training materials
- Performance optimizations without architectural changes

### **REQUIRES APPROVAL:**
- New database migrations or schema changes
- Authentication flow modifications  
- Payment system updates
- Translation system enhancements
- Major dependency updates

### **PRODUCTION SUCCESS PRINCIPLES:**
1. **Understand First:** Read existing code and patterns thoroughly
2. **Minimal Change:** Smallest viable fix that fits the system
3. **Reuse Infrastructure:** Don't reinvent - use established patterns
4. **Test Carefully:** Validate all changes before commit
5. **Ask Before Major Changes:** Get explicit approval for high-risk modifications

---

**This is a mature, production-ready system serving real users. Every change matters. Build thoughtfully. 🌴**
