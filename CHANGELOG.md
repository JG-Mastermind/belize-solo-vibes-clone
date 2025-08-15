# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed - CRITICAL 🚨
- **EMERGENCY**: Resolved 5-day admin portal authentication outage
  - Fixed multiple Supabase client instances causing auth conflicts (removed duplicate `src/lib/supabase.ts`)
  - Updated `handle_new_user()` database trigger to include missing `user_type` field
  - Fixed `getUserRole()` function using `.single()` instead of `.maybeSingle()`
  - Resolved data inconsistency between `auth.users` and `public.users` tables
  - Restored admin access for super admin, admin, and tour guide roles

### Fixed
- Enhanced Jest configuration with proper ESModule support and TypeScript compatibility
- Resolved React import issues in test files with esModuleInterop
- Fixed AuthProvider type safety issues in RequireRole component
- Corrected test mocking patterns to prevent initialization errors

### Security
- **CRITICAL**: Verified password reset flow security - no auto-login vulnerabilities
- Confirmed RequireRole component properly protects admin routes with server-side validation
- Validated auth callback prevents session adoption during recovery flows
- Ensured RLS policies prevent user enumeration attacks
- **ALERT**: Added comprehensive post-mortem documentation for authentication crisis prevention

### Changed
- Established production project status and development principles in CLAUDE.md
- Updated footer popular adventures with proper bilingual SEO URLs
- Improved RequireRole to use getUserRole() method instead of direct user.user_type access

### Added
- Claude Code specialized agents for modular development approach
- Enterprise-grade dynamic popular adventures system
- Comprehensive CHANGELOG.md for tracking project changes
- **Emergency Response**: Supabase Edge Functions for secure admin user management
  - `create-admin-user`: Secure admin account creation with proper role metadata
  - `delete-user`: Safe user deletion via Auth Admin API
  - `update-admin-password`: Secure password updates bypassing frontend issues
  - `test-auth`: Direct authentication testing for debugging
- Enhanced authentication debugging utilities (`clearAuthState.ts`, `testAdminRole.ts`)
- Comprehensive admin login form with role polling and error handling
- Password reset form with security enforcement (no auto-login)
- Post-mortem documentation and prevention checklists in CLAUDE.md

### Security Analysis Summary
- ✅ Password reset flow: Secure - tokens properly validated, single-use enforced, no auto-login
- ✅ Admin portal access: Protected via RequireRole with server-side role validation
- ✅ Auth callback: Properly handles recovery without session adoption
- ✅ RLS policies: Prevent unauthorized access and user enumeration

## [0.1.0] - 2025-01-XX

### Added
- Initial BelizeVibes tourism platform implementation
- Vite + React 18 + TypeScript frontend architecture
- Supabase backend with PostgreSQL, Auth, Storage, Edge Functions
- Stripe payment integration
- Bilingual support (English/French Canadian) with i18next
- shadcn/ui component library with Tailwind CSS
- React Router v6 with nested layouts
- TanStack Query for state management
- Comprehensive test suite with Jest and React Testing Library
- Admin portal with role-based access control
- Booking system with multi-step flow
- Blog system with dynamic content
- SEO optimization with React Helmet
- Security headers and CSP configuration
- CI/CD pipeline with GitHub Actions

### Security
- Row Level Security (RLS) policies implemented
- Role-based authentication with Supabase Auth
- SECURITY DEFINER functions for secure operations
- Audit logging for admin operations