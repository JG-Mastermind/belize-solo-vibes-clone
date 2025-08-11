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
