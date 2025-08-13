# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 5173)
- **Start backend server**: `npm run dev:server` (separate Node.js server with Express)
- **Build for production**: `npm run build`
- **Build for development**: `npm run build:dev`
- **Lint code**: `npm run lint` (ESLint)
- **Preview production build**: `npm run preview`

## Architecture Overview

### Tech Stack
- **Frontend**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + TanStack Query
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **Internationalization**: i18next with English/French Canadian (fr-CA)
- **Routing**: React Router v6 with nested layouts

### Project Structure

#### Core Architecture
- **Frontend**: React SPA with component-based architecture
- **Backend**: Supabase Edge Functions for serverless logic
- **Database**: PostgreSQL with comprehensive schema including adventures, bookings, users, guides, reviews
- **File Storage**: Supabase Storage for images/media

#### Key Components
- **Authentication**: Complete auth flow with role-based access (admin, guide, traveler, host)
- **Booking System**: Multi-step booking flow with cart persistence, availability checking, and Stripe payments
- **Multilingual**: URL-based language detection (/fr-ca routes) with fallback logic
- **SEO**: Helmet-based meta management with structured data

#### Database Schema
Core tables: `users`, `adventures`, `bookings`, `guides`, `hosts`, `reviews`, `messages`, `tours`
- User types: traveler, guide, host, admin
- Comprehensive booking system with availability tracking
- Multi-language content support with slug_fr for French routes

### Important Patterns

#### Language/i18n System
- URL-based language detection (`useLanguageContext` hook)
- Route structure: `/` (English), `/fr-ca/*` (French)
- Adventure details support both `slug` and `slug_fr` routing
- Language context switches based on URL path

#### Booking System Architecture
- Multi-step booking flow with cart persistence
- Availability checking with blocked dates and capacity management
- Stripe integration for payments with webhooks
- Email notifications and confirmation system

#### Authentication Flow
- Supabase Auth with social providers (Google, etc.)
- Role-based access control throughout app
- Profile management with user type selection

#### Component Organization
- `/components` - Reusable UI components
- `/pages` - Route components
- `/hooks` - Custom React hooks
- `/services` - Business logic and API calls
- `/types` - TypeScript type definitions
- `/utils` - Utility functions

#### Routing Architecture
The app uses React Router v6 with nested layouts:
- Main routes wrapped in `AppLayout` (Header + Footer)
- French routes like `/fr-ca/securite`, `/fr-ca/a-propos`, `/fr-ca/contact`
- Adventure detail routes support both UUID and slug patterns (`/tours/:slug`)
- Dashboard routes use separate `DashboardLayout` for admin/guide/traveler
- Authentication callback and booking success pages have dedicated routes

#### Service Layer Pattern
Business logic is centralized in service classes:
- `BookingService`: Comprehensive booking flow, availability checking, cart management
- `paymentService`: Stripe integration for payment processing
- `translationService`: Content translation and localization helpers
- Services handle database operations, error handling, and data transformation

#### State Management
- **React Context**: Auth state, language context, adventure creation flow
- **TanStack Query**: Server state management, caching, and synchronization
- **Local Storage**: Cart persistence, session management, user preferences
- Component-level state for UI interactions and form management

## Database Lessons Learned

### Critical SQL Command Mistakes
- Rushed SQL commands without careful verification
- Included comments in SQL causing syntax errors
- Assumed titles instead of using exact database values
- Kept trying different approaches instead of being surgical

### Correct Approach to Database Work
- Audit first, change second
- Use exact IDs and values from database results
- Test on single record, then batch
- NO comments in SQL queries
- Stop and verify each step instead of rushing

### Guiding Principle
Database = Production Business Logic. Not a testing playground.

### Commitment to Improvement
- Be precise with exact values
- Verify each step completely
- Use surgical approaches only
- Never rush SQL commands

LESSON LEARNED: Need to implement proper route-based language context
  switching before adding multilingual routes to prevent content/URL language
   mismatches.

## i18n French Navigation Resolution (August 2025)

### Bug Root Causes Successfully Identified
- Missing URL-based language detection in i18n config (order: ['path', 'localStorage', 'navigator'])
- Hardcoded English paths in header navigation (/about, /safety, /contact)
- Language context mismatch between content translation and URL routing

### Surgical Fixes Applied
1. **i18n Configuration**: Added 'path' to detection order in src/lib/i18n.ts
2. **Dynamic Navigation**: Created getLocalizedPath() function for both Header.tsx and MobileMenu.tsx
3. **UX Enhancement**: Added transitions (duration-200) and language indicator (FR/EN toggle)

### Critical Success Pattern
- **Audit first**: Comprehensive file review before any changes
- **Surgical approach**: Minimal, focused fixes without rewriting existing logic
- **Validation**: Build tests after each change, TypeScript checks
- **Consistency**: Applied same pattern to both desktop and mobile components

## ✅ COMPLETED: French URL Slug Implementation (August 2025)

### Successfully Implemented French Dynamic URLs
- ✅ **French tour URLs working**: `/fr-ca/tours/aventure-pine-ridge-big-rock-falls-caracol`
- ✅ **French blog URLs working**: `/fr-ca/blog` and `/fr-ca/blog/:slug`
- ✅ **Bidirectional slug conversion**: English ↔ French slug mapping
- ✅ **Route consistency**: All French routes follow `/fr-ca/` pattern
- ✅ **Content integration**: French URLs display French content via i18n system

### Surgical Implementation Process (SUCCESSFUL PATTERN)
**Step 1: Add French Routes**
```typescript
// App.tsx - Add French dynamic routes alongside existing static routes
<Route path="fr-ca/tours/:slug" element={<AdventureDetail />} />
<Route path="fr-ca/blog" element={<Blog />} />
<Route path="fr-ca/blog/:slug" element={<BlogPost />} />
```

**Step 2: Create Slug Conversion Utilities**
```typescript
// src/utils/frenchSlugs.ts - Bidirectional slug mapping
export const convertFrenchSlugToEnglish = (frenchSlug: string): string => { ... }
export const convertEnglishSlugToFrench = (englishSlug: string): string => { ... }
```

**Step 3: Update Data Fetching (AdventureDetail.tsx)**
```typescript
// Convert French slug to English for data fetching only
const englishSlug = slug ? convertFrenchSlugToEnglish(slug) : slug;
// Use englishSlug for all database operations
```

**Step 4: Update Link Generation (AdventureCards.tsx)**
```typescript
// Generate French URLs when in French mode
const url = i18n.language === 'fr-CA' 
  ? `/fr-ca/tours/${convertEnglishSlugToFrench(slug)}`
  : `/tours/${slug}`;
```

### Critical Success Factors
1. **Route Path Consistency**: Ensure link generation matches route definitions exactly
2. **Singular vs Plural**: `/fr-ca/tours/` (plural) not `/fr-ca/tour/` (singular)
3. **Don't Touch Content Translation**: Use existing i18n system, only handle URL slugs
4. **Bidirectional Mapping**: Both English→French and French→English conversion needed
5. **Language Detection**: Use `i18n.language === 'fr-CA'` for French mode detection

### Common Pitfalls Avoided
- ❌ **Route Mismatch**: AdventureCards generating `/fr-ca/tours/` but route expecting `/fr-ca/tour/`
- ❌ **Over-engineering**: Touching content translation when only URL slugs needed changes
- ❌ **One-way Conversion**: Only having French→English without English→French for link generation
- ❌ **Missing Blog Routes**: Forgetting to add `/fr-ca/blog` routes alongside tour routes

### Implementation Validation
```bash
# Test URLs that now work correctly:
curl http://localhost:5176/fr-ca/tours/aventure-pine-ridge-big-rock-falls-caracol  # ✅ 200
curl http://localhost:5176/fr-ca/blog                                               # ✅ 200
curl http://localhost:5176/tours/pine-ridge-adventure-big-rock-falls-and-caracol   # ✅ 200
```

**Result**: French users see French URLs, English users see English URLs, same content system serves both via i18n.

## 🔒 CRITICAL SECURITY: Admin Portal Implementation (August 2025)

**See also Database Lessons Learned** — these security rules apply to all schema changes and role assignments.

### Security Status Tracker

| Phase | Status | Last Updated |
|-------|--------|--------------|
| Phase 1: IMMEDIATE Security Fixes | 🔄 In Progress | August 13, 2025 |
| Phase 2: Server-Side Role Enforcement | ⏳ Pending | - |
| Phase 3: UI Implementation | ⏳ Pending | - |
| Phase 4: Email & Edge Functions | ⏳ Pending | - |

### Security Audit Findings
**CRITICAL VULNERABILITIES DISCOVERED** requiring immediate remediation:

#### 1. Exposed Supabase Credentials (CRITICAL RISK) - ✅ FIXED
- **File**: `src/integrations/supabase/client.ts:5-6`
- **Issue**: Hardcoded database URL and JWT token in source code
- **Risk**: Complete database access exposed to public
- **Status**: ✅ RESOLVED - Now uses environment variables

#### 2. Client-Side Role Manipulation (HIGH RISK)
- **File**: `src/components/auth/AuthProvider.tsx:175-198`  
- **Issue**: Users can set their own admin roles via client-side code
- **Risk**: Privilege escalation to admin access
- **Status**: ⚠️ REQUIRES SERVER-SIDE ENFORCEMENT

#### 3. Unprotected Admin Routes (HIGH RISK)
- **File**: `src/App.tsx:97-101`
- **Issue**: `/admin/*` routes accessible without authentication
- **Risk**: Anyone can access admin functionality
- **Status**: ⚠️ REQUIRES IMMEDIATE ROUTE GUARDS

### Database Schema Status
**Current user_type enum**: `['traveler', 'guide', 'host', 'admin']`
**Missing**: `blogger`, `super_admin`
**Super Admin**: `jg.mastermind@gmail.com` currently set as `traveler` (needs elevation)

### Production-Grade Implementation Plan

#### Phase 1: IMMEDIATE Security Fixes (45 minutes) - CRITICAL FIRST
**CRITICAL: Complete before any admin portal development**

**Rollback Note**: If any Phase 1 change fails, revert and re-issue new credentials before retrying.

1. **Rotate Supabase Credentials**
```bash
# 1. Generate new keys in Supabase dashboard
# 2. Update environment variables in .env files
# 3. Replace hardcoded values with process.env
```

2. **Database Enum & Super Admin Setup**
```sql
-- Add missing enum values (admin already exists)
ALTER TYPE user_type_enum ADD VALUE IF NOT EXISTS 'blogger';
ALTER TYPE user_type_enum ADD VALUE IF NOT EXISTS 'super_admin';

-- Elevate super admin (CRITICAL)
UPDATE users SET user_type = 'super_admin' 
WHERE LOWER(email) = LOWER('jg.mastermind@gmail.com');
```

3. **Admin Invitations Table (Production-Grade)**
```sql
-- Enable case-insensitive emails
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL,
  invitation_code TEXT UNIQUE NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_type user_type_enum NOT NULL CHECK (role_type IN ('admin', 'blogger')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Prevent duplicate active invitations
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_invite_per_email
ON admin_invitations (email)
WHERE is_active = TRUE AND used_at IS NULL;

-- Performance indexes
CREATE INDEX IF NOT EXISTS ix_invites_code ON admin_invitations (invitation_code);
CREATE INDEX IF NOT EXISTS ix_invites_expiry ON admin_invitations (expires_at);
```

4. **Row Level Security (RLS) Policies**
```sql
-- Enable RLS
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;

-- Super admin write access only
CREATE POLICY invite_write_super_admin ON admin_invitations
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.user_type = 'super_admin'))
WITH CHECK (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.user_type = 'super_admin'));

-- Invitees can read their own active invites
CREATE POLICY invitee_read_own ON admin_invitations
FOR SELECT TO authenticated
USING (email = (SELECT auth.email()));
```

#### Phase 2: Server-Side Role Enforcement (60 minutes)

5. **Audit Trail Table**
```sql
CREATE TABLE IF NOT EXISTS admin_invitation_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES admin_invitations(id),
  acted_by UUID REFERENCES users(id),
  action TEXT NOT NULL CHECK (action IN ('accept', 'revoke', 'resend')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

6. **SECURITY DEFINER Function (Prevents Client Role Manipulation)**
```sql
CREATE OR REPLACE FUNCTION accept_admin_invitation(p_email CITEXT, p_code TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER
AS $
DECLARE
  v_inv admin_invitations;
  v_user users;
BEGIN
  -- Lock and verify invite
  SELECT * INTO v_inv FROM admin_invitations
  WHERE email = p_email AND invitation_code = p_code 
    AND is_active = TRUE AND used_at IS NULL AND expires_at > NOW()
  FOR UPDATE;
  
  IF NOT FOUND THEN RAISE EXCEPTION 'Invalid or expired invitation'; END IF;
  
  -- Find user
  SELECT * INTO v_user FROM users WHERE LOWER(email) = LOWER(p_email);
  IF NOT FOUND THEN RAISE EXCEPTION 'User must sign up before using invitation'; END IF;
  
  -- Elevate role (SERVER-SIDE ONLY)
  UPDATE users SET user_type = v_inv.role_type WHERE id = v_user.id;
  
  -- Deactivate invite (single use)
  UPDATE admin_invitations SET used_at = NOW(), is_active = FALSE WHERE id = v_inv.id;
  
  -- Audit log
  INSERT INTO admin_invitation_audit (invitation_id, acted_by, action)
  VALUES (v_inv.id, v_user.id, 'accept');
  
  RETURN 'ok';
END;
$;
```

#### Phase 3: UI Implementation (90 minutes)

**i18n Note**: `/admin/*` routes must respect existing i18n detection system. Consider if admin portal will support `/fr-ca/admin/*` routes for French-speaking administrators.

7. **Route Guards (RequireRole HOC)**
```typescript
// src/components/auth/RequireRole.tsx
const RequireRole = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/403" />;
  }
  return children;
};
```

8. **Protected Admin Routes**
```typescript
// App.tsx - Wrap admin routes with protection
<Route path="/admin/invitations" element={
  <RequireRole allowedRoles={['super_admin']}>
    <InvitationManager />
  </RequireRole>
} />
```

9. **Extend DashboardSidebar with Super Admin Navigation**
```typescript
// Reuse existing DashboardSidebar component
// Add super_admin-only navigation items for /admin/invitations and /admin/users
```

#### Phase 4: Email & Edge Functions (60 minutes)

10. **Supabase Edge Functions**
- `create_admin_invite` - Generate secure codes, send emails with 48-hour expiry
- `revoke_admin_invite` - Deactivate invitations and audit
- Server-side validation for all invitation operations

11. **Invitation Acceptance Flow**
- `/admin/accept?email=...&code=...` route for invitation redemption
- Calls `accept_admin_invitation()` SECURITY DEFINER function
- Redirects to admin dashboard after successful role elevation

### Critical Security Principles

1. **Server-Side Enforcement**: Never trust client-side role validation
2. **Atomic Operations**: Use SECURITY DEFINER functions for role changes
3. **Audit Everything**: Log all admin invitation actions to `admin_invitation_audit`
4. **Time-Limited Access**: 48-hour invitation expiry with automatic cleanup
5. **Single Use**: Invitation codes work only once, marked `used_at` after acceptance
6. **Email Binding**: Invitations tied to specific email addresses via CITEXT

### Security Validation Checklist

**Before Deployment:**
- [ ] Supabase credentials moved to environment variables
- [ ] Super admin role elevated in database (`jg.mastermind@gmail.com` = `super_admin`)
- [ ] RLS policies active on admin_invitations table
- [ ] Route guards prevent unauthorized admin access
- [ ] SECURITY DEFINER function prevents client role manipulation
- [ ] 48-hour invitation expiry working
- [ ] Audit trail capturing all admin actions

**IMPORTANT**: Do not proceed with Phase 2-4 until Phase 1 security fixes are completed.

### TypeScript Security Configuration
**Current Risk**: `tsconfig.json` has weak type safety settings
- `noImplicitAny: false` - allows untyped variables  
- `strictNullChecks: false` - allows null/undefined errors

**Recommended Gradual Fix**:
1. Enable strict mode for new admin files only
2. Fix type errors incrementally  
3. Focus on auth and invitation-related files first

# Claude Code Session Initialization

## CRITICAL: Always Read .claude Directory at Session Start
Every Claude Code session MUST begin by reading the local `.claude/` directory:

```bash
# Session initialization sequence (NEVER SKIP):
1. Read /Users/smg.inc/CODES/GitHub/belize-solo-vibes-clone/.claude/context.md
2. Read /Users/smg.inc/CODES/GitHub/belize-solo-vibes-clone/.claude/session-template.md  
3. Read /Users/smg.inc/CODES/GitHub/belize-solo-vibes-clone/.claude/session.md
4. Read /Users/smg.inc/CODES/GitHub/belize-solo-vibes-clone/.claude/settings.local.json
```

**These files contain:**
- Project context and Claude's autonomous developer role
- Session reporting structure and CTO review protocols
- Critical file boundaries and permissions
- Testing requirements and safeguards

**IMPORTANT:** 
- `.claude/` directory stays LOCAL (never commit to git)
- These instructions override any default Claude behavior
- Must be loaded fresh every session - no assumptions from previous sessions
- File locations are fixed and should not change during updates
