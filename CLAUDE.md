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

## Next Phase: Dynamic SEO for French Tours

### Current State
- ✅ Static pages working: /fr-ca/securite, /fr-ca/a-propos, /fr-ca/contact
- ✅ Navigation fixed: Header menu respects language context
- ✅ SEO foundation: hreflang tags, sitemap includes French URLs

### Phase 3 Requirements: Dynamic Pages (/fr-ca/tours/:frenchSlug)
**Critical Database Work Needed:**
- Add slug_fr column to tours table via migration
- Populate French slugs (e.g., aventure-pine-ridge-big-rock-falls-caracol)
- Create src/utils/frenchSlugs.ts with convertFrenchSlugToEnglish function
- Update AdventureDetail.tsx to handle French slug routing

### Database Migration Approach
- Follow exact Database Lessons Learned above
- Test migration on single record first
- Use exact tour IDs from production data
- NO comments in SQL migration files
- Verify each French slug is unique before batch update

### Validation Requirements
- /fr-ca/tours/aventure-pine-ridge-big-rock-falls-caracol must load correct tour
- French content must render with proper SEO metadata
- English fallback must work if French slug missing
- No impact to existing /tours/:slug English routes
- All routes must maintain URL-path consistency with content language
