# 🏗️ BelizeVibes Project Structure & Dependencies

*Last Updated: August 4, 2025 - Synchronized with PROJECT_UPDATE.md*

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Package Dependencies](#package-dependencies)
- [File Structure](#file-structure)
- [Core Application Files](#core-application-files)
- [Components Structure](#components-structure)
- [Database & Integrations](#database--integrations)
- [Build Configuration](#build-configuration)
- [Security & Configuration Status](#security--configuration-status)

---

## 🎯 Project Overview

**Project Name:** BelizeVibes Adventure Booking Platform  
**Framework:** React 18 + TypeScript + Vite  
**UI Library:** shadcn/ui + Radix UI  
**Backend:** Supabase (PostgreSQL + Auth + Storage)  
**Payment:** Stripe Integration  
**Styling:** Tailwind CSS  
**Status:** ⚠️ Functional with critical security issues requiring immediate attention  

---

## 📦 Package Dependencies

### 🚀 Production Dependencies

#### **Core Framework**
- `react: ^18.3.1` - React library
- `react-dom: ^18.3.1` - React DOM renderer
- `react-router-dom: ^6.26.2` - Client-side routing

#### **UI & Styling**
- `@radix-ui/react-*` - Primitive UI components (20+ packages)
- `class-variance-authority: ^0.7.1` - CSS class variance utility
- `clsx: ^2.1.1` - Conditional className utility
- `tailwind-merge: ^2.5.2` - Tailwind class merging
- `tailwindcss-animate: ^1.0.7` - Tailwind animations
- `lucide-react: ^0.462.0` - Icon library
- `next-themes: ^0.3.0` - Theme switching

#### **Forms & Validation**
- `react-hook-form: ^7.53.0` - Form management
- `@hookform/resolvers: ^3.9.0` - Form validation resolvers
- `zod: ^3.23.8` - Schema validation

#### **Backend & Database**
- `@supabase/supabase-js: ^2.50.4` - Supabase client
- `@tanstack/react-query: ^5.56.2` - Data fetching & caching

#### **Payment Processing**
- `@stripe/stripe-js: ^7.4.0` - Stripe JavaScript SDK
- `@stripe/react-stripe-js: ^3.7.0` - Stripe React components
- `stripe: ^18.3.0` - Stripe Node.js SDK

#### **Charts & Data Visualization**
- `recharts: ^2.12.7` - React charting library

#### **Internationalization (i18n)**
- `i18next: ^25.3.2` - Core internationalization framework
- `react-i18next: ^15.6.1` - React integration for i18next
- `i18next-browser-languagedetector: ^8.2.0` - Language detection

#### **Rich Text & Content**
- `@tiptap/react: ^3.0.9` - Rich text editor
- `@tiptap/starter-kit: ^3.0.9` - Tiptap starter components
- `@tiptap/extension-image: ^3.0.9` - Image extension for Tiptap

#### **Utilities**
- `date-fns: ^3.6.0` - Date manipulation
- `sonner: ^1.5.0` - Toast notifications
- `cmdk: ^1.0.0` - Command palette
- `input-otp: ^1.2.4` - OTP input component
- `embla-carousel-react: ^8.3.0` - Carousel component
- `react-day-picker: ^8.10.1` - Date picker
- `react-resizable-panels: ^2.1.3` - Resizable panels
- `vaul: ^0.9.3` - Drawer component
- `react-helmet-async: ^2.0.5` - Document head management

### 🛠️ Development Dependencies

#### **Build Tools**
- `vite: ^5.4.1` - Build tool
- `@vitejs/plugin-react-swc: ^3.5.0` - React plugin for Vite
- `typescript: ^5.8.3` - TypeScript compiler

#### **Linting & Code Quality**
- `eslint: ^9.9.0` - JavaScript/TypeScript linter
- `@eslint/js: ^9.9.0` - ESLint JavaScript rules
- `typescript-eslint: ^8.0.1` - TypeScript ESLint rules
- `eslint-plugin-react-hooks: ^5.1.0-rc.0` - React Hooks linting
- `eslint-plugin-react-refresh: ^0.4.9` - React Refresh linting

#### **Styling**
- `tailwindcss: ^3.4.11` - Utility-first CSS framework
- `@tailwindcss/typography: ^0.5.15` - Typography plugin
- `autoprefixer: ^10.4.20` - CSS autoprefixer
- `postcss: ^8.4.47` - CSS processor

#### **Types**
- `@types/node: ^22.5.5` - Node.js type definitions
- `@types/react: ^18.3.3` - React type definitions
- `@types/react-dom: ^18.3.0` - React DOM type definitions
- `@types/stripe: ^8.0.416` - Stripe type definitions

#### **Development Tools**
- `ts-node: ^10.9.2` - TypeScript execution engine
- `globals: ^15.9.0` - Global variables for ESLint
- `lovable-tagger: ^1.1.7` - Development tagging tool

---

## 📁 File Structure

### 🗂️ Root Directory
```
├── package.json                    # Project dependencies & scripts
├── package-lock.json              # Lock file for dependencies
├── bun.lockb                       # Bun lock file (alternative package manager)
├── tsconfig.json                   # TypeScript configuration (⚠️ strict mode disabled)
├── tsconfig.app.json              # App-specific TypeScript config
├── tsconfig.node.json             # Node-specific TypeScript config
├── vite.config.ts                 # Vite build configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.mjs              # ESLint configuration
├── components.json                # shadcn/ui configuration
├── README.md                      # Project documentation
├── PROJECT_UPDATE.md              # 🆕 Comprehensive project status report
├── PROJECT_STRUCTURE.md           # This file - project structure docs
├── CLAUDE.md                      # Database lessons learned & guidelines
├── AUTHENTICATION_SETUP.md        # Auth setup guide
├── OAUTH_SETUP.md                 # OAuth setup guide
├── setup-review-photos-bucket.md  # Storage setup guide
├── database-fixes/                # Database migration history
│   ├── archive/                   # Archived database scripts
│   └── completed/                 # Completed database fixes
└── scripts/                       # Utility scripts
    ├── seedTours.ts              # Tour seeding script
    └── verifyTours.ts            # Tour verification script
```

### 📱 Source Code (`src/`)
```
src/
├── main.tsx                       # Application entry point
├── App.tsx                        # Main application component
├── index.css                      # Global styles & Tailwind imports
├── vite-env.d.ts                 # Vite environment types
├── server.ts                      # Express server (unused in Vite setup)
├── components/                    # 50+ reusable components
│   ├── ui/                       # 46 shadcn/ui components
│   ├── auth/                     # Authentication components
│   ├── booking/                  # Booking flow components
│   ├── dashboard/                # Dashboard & admin components
│   └── admin/                    # Admin-specific components
├── pages/                         # Route components (18 total)
│   ├── dashboard/                # Protected dashboard pages
│   ├── admin/                    # Admin-only pages
│   ├── auth/                     # Authentication pages
│   └── booking/                  # Booking-related pages
├── hooks/                         # Custom React hooks (7 hooks)
├── contexts/                      # React contexts (Adventure creation)
├── lib/                          # Utility libraries
│   ├── ai/                       # AI integration (OpenAI)
│   ├── i18n.ts                   # ⚠️ Large i18n config file (44k+ tokens)
│   └── supabase.ts               # ⚠️ Contains hardcoded credentials
├── services/                     # API services (3 services)
├── types/                        # TypeScript type definitions
├── data/                         # Static data & schemas
├── utils/                        # Utility functions
└── integrations/                 # Third-party integrations
    └── supabase/                 # Supabase client & types
```

---

## 🎯 Core Application Files

### 📍 `src/main.tsx`
**Purpose:** Application entry point  
**Dependencies:**
- `react` - Core React library
- `react-dom/client` - React DOM client
- `./App.tsx` - Main app component
- `./index.css` - Global styles

### 📍 `src/App.tsx`
**Purpose:** Main application router and layout  
**Dependencies:**
- `react-router-dom` - Routing components
- `@tanstack/react-query` - Query client
- `./components/ui/toaster` - Toast notifications
- `./components/ui/sonner` - Toast system
- `./components/ui/tooltip` - Tooltip provider
- `./components/auth/AuthProvider` - Authentication context
- `./contexts/AdventureCreationContext` - Adventure creation state
- `./components/Header` - Header component
- `./components/Footer` - Footer component
- `./components/dashboard/DashboardLayout` - Dashboard layout
- Multiple page components

### 📍 `src/components/auth/AuthProvider.tsx`
**Purpose:** Authentication context and user management  
**Dependencies:**
- `react` - React hooks and context
- `@supabase/supabase-js` - Supabase types and providers
- `@/integrations/supabase/client` - Supabase client instance

### 📍 `src/integrations/supabase/client.ts`
**Purpose:** Supabase client configuration  
**⚠️ SECURITY ISSUE:** Contains hardcoded credentials that should be in environment variables  
**Dependencies:**
- `@supabase/supabase-js` - Supabase client library
- `./types` - Database type definitions

### 📍 `src/services/translationService.ts`
**Purpose:** AI-powered translation service using OpenAI  
**Dependencies:**
- OpenAI API integration
- Language detection utilities
- Supports English/French (Canadian) translation

---

## 🧩 Components Structure

### 🔐 Authentication (`src/components/auth/`)
```
auth/
├── AuthProvider.tsx              # Auth context provider with Supabase
├── SignInModal.tsx               # Login/signup modal with role support
├── SignUpModal.tsx               # Signup modal (legacy - may be unused)
├── RoleSelection.tsx             # Role selection (admin/guide/traveler)
├── PasswordStrengthIndicator.tsx # Password validation UI
└── utils/
    └── passwordStrength.ts       # Password strength utility functions
```

### 📅 Booking System (`src/components/booking/`)
```
booking/
├── BookingWidget.tsx             # Main booking widget
├── BookingStepIndicator.tsx      # Step progress indicator
├── BookingSummary.tsx            # Booking summary
├── DateSelectionStep.tsx         # Date selection
├── ImageGallery.tsx              # Adventure image gallery
├── PaymentStep.tsx               # Payment processing
├── SocialProof.tsx               # Social proof elements
└── steps/
    ├── BookingStepOne.tsx        # Date & time selection
    ├── BookingStepTwo.tsx        # Guest details
    ├── BookingStepThree.tsx      # Contact information
    ├── BookingStepFour.tsx       # Payment method
    └── BookingStepFive.tsx       # Confirmation
```

### 📊 Dashboard (`src/components/dashboard/`)
```
dashboard/
├── DashboardLayout.tsx           # Dashboard layout wrapper
├── DashboardSidebar.tsx          # Navigation sidebar
├── DashboardTopbar.tsx           # Top navigation bar
├── AIAssistantPanel.tsx          # AI content generation
├── BookingsTable.tsx             # Bookings data table
├── DashboardCharts.tsx           # Analytics charts
└── StatsCard.tsx                 # Statistics card component
```

### 🎨 UI Components (`src/components/ui/`)
**46 shadcn/ui components including:**
- `button.tsx`, `input.tsx`, `form.tsx` - Form components
- `dialog.tsx`, `sheet.tsx`, `popover.tsx` - Modal components
- `table.tsx`, `card.tsx`, `tabs.tsx` - Layout components
- `select.tsx`, `checkbox.tsx`, `calendar.tsx` - Input components
- `ImageUploader.tsx` - Custom file upload component
- `translation-button.tsx` - 🆕 Custom translation UI component

### 🏠 Layout Components (`src/components/`)
```
components/
├── Header.tsx                    # Main navigation with i18n support
├── Footer.tsx                    # Site footer with bilingual content
├── Hero.tsx                      # Landing page hero section
├── InteractiveHero.tsx           # Enhanced hero with dynamic content
├── AdventureCards.tsx            # Adventure listing components
├── Testimonials.tsx              # Customer reviews display
├── MobileMenu.tsx                # Mobile navigation
├── BottomNav.tsx                 # Mobile bottom navigation
├── ScrollToTop.tsx               # Scroll to top utility
├── UserProfile.tsx               # User profile management
├── ReviewForm.tsx                # Review submission form
├── StripeProvider.tsx            # Stripe payment context
└── StripePaymentForm.tsx         # Stripe payment components
```

---

## 📄 Pages Structure

### 🏠 Public Pages (`src/pages/`)
```
pages/
├── LandingPage.tsx               # Homepage with hero & features
├── About.tsx                     # About page (⚠️ needs French translation)
├── Contact.tsx                   # Contact page with i18n support
├── Blog.tsx                      # Blog listing with bilingual support
├── BlogPost.tsx                  # Individual blog post view
├── Safety.tsx                    # Safety information (⚠️ needs French)
├── AdventuresPage.tsx            # Adventure listing page
├── AdventureDetail.tsx           # Adventure details with booking
├── Booking.tsx                   # Booking page
├── BookingCheckout.tsx           # Checkout process with Stripe
├── Confirmation.tsx              # Booking confirmation
├── NotFound.tsx                  # 404 page
├── auth/
│   └── callback.tsx              # OAuth callback handler
├── booking/
│   └── success.tsx               # Payment success page
├── admin/                        # Admin-only pages
│   ├── AdminAdventures.tsx       # Adventure management
│   ├── AdminCreateAdventure.tsx  # Adventure creation
│   └── AdminEditAdventure.tsx    # Adventure editing
└── dashboard/                    # Protected dashboard pages
    ├── AdminDashboard.tsx        # Admin analytics & management
    ├── GuideDashboard.tsx        # Guide-specific dashboard
    ├── TravelerDashboard.tsx     # User booking history
    ├── CreateAdventure.tsx       # Adventure creation form
    ├── CreatePost.tsx            # Blog post creation
    └── EditPost.tsx              # Blog post editing
```

---

## 🔧 Hooks & Services

### 🎣 Custom Hooks (`src/hooks/`)
```
hooks/
├── useBookingFlow.ts             # Booking state management
├── useCreatePaymentIntent.ts     # Payment intent creation
├── useDashboardAnalytics.ts      # Dashboard data fetching
├── useStripePayment.ts           # Stripe payment processing
├── useTranslation.ts             # 🆕 Custom translation hook
├── use-mobile.tsx                # Mobile detection utility
└── use-toast.ts                  # Toast notifications
```

### 🛠️ Services (`src/services/`)
```
services/
├── bookingService.ts             # Booking API operations
├── paymentService.ts             # Payment processing (⚠️ has security issues)
└── translationService.ts         # 🆕 AI-powered translation service
```

### 📚 Libraries (`src/lib/`)
```
lib/
├── utils.ts                      # General utilities (cn, etc.)
├── stripe.ts                     # Stripe configuration
├── supabase.ts                   # ⚠️ Contains hardcoded credentials
├── storage.ts                    # Supabase Storage utilities
├── i18n.ts                       # 🆰 Large internationalization config
├── locale.ts                     # Locale utilities
├── navigation.ts                 # Navigation utilities
└── ai/                          # AI integration modules
    ├── index.ts                  # AI module exports
    ├── generateDescription.ts    # AI description generation
    └── generateImage.ts          # AI image generation
```

---

## 🗄️ Database & Integrations

### 🐘 Supabase Setup (`supabase/`)
```
supabase/
├── migrations/                   # Database migrations (12 files)
│   ├── 20250110_booking_system_integration.sql
│   ├── 20250709173035-02cb4878-fd46-44ad-84ac-f22505fa2151.sql
│   ├── 20250710000000-booking-system-schema.sql
│   ├── 20250710165559-9f8b3bfe-593e-4667-9882-c822e21cc6d2.sql
│   ├── 20250711000000-comprehensive-belizevibes-schema.sql
│   ├── 20250712000000-simple-testimonials-table.sql
│   ├── 20250712000001-add-images-to-testimonials.sql
│   ├── 20250715_test_accounts.sql
│   ├── 20250718_120000_fix_review_trends_function.sql
│   ├── 20250719_140000_create_tours_table.sql
│   ├── 20250720_allow_anon_tours_insert.sql
│   ├── 20250721_remove_anon_tours_insert.sql
│   ├── 20250804000000_add_french_translations_to_blog.sql
│   └── _skip_20250715_admin_dashboard_analytics.sql (skipped)
└── functions/                    # Edge Functions (3 active)
    ├── create-payment-intent/
    │   └── index.ts              # Stripe payment intent creation
    ├── create-payment/
    │   └── index.ts              # Payment processing
    ├── stripe-webhook/
    │   └── index.ts              # Stripe webhook handler
    └── get_booking_analytics.sql # Analytics function
```

### 🔌 Integrations (`src/integrations/`)
```
integrations/
└── supabase/
    ├── client.ts                 # ⚠️ Supabase client with hardcoded keys
    ├── client.ts.backup          # Backup file (should be removed)
    └── types.ts                  # Auto-generated database types (extensive)
```

---

## ⚙️ Build Configuration

### 📋 Configuration Files
- **`vite.config.ts`** - Vite build tool configuration
- **`tailwind.config.ts`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript compiler options
- **`eslint.config.mjs`** - Code linting rules
- **`postcss.config.js`** - CSS processing
- **`components.json`** - shadcn/ui configuration

### 🚀 Build Scripts
```json
{
  "dev": "vite",                  // Development server
  "build": "vite build",          // Production build
  "preview": "vite preview",      // Preview production build
  "lint": "eslint ."              // Code linting
}
```

---

## 🔗 Key Dependency Relationships

### 📊 High-Level Architecture
```
App.tsx
├── AuthProvider (Supabase Auth)
├── AdventureCreationContext
├── React Query Provider
├── Router (react-router-dom)
│   ├── Public Pages
│   │   ├── Index, About, Contact, Blog
│   │   ├── AdventureDetail
│   │   └── Booking Flow
│   └── Dashboard (Protected)
│       ├── AdminDashboard
│       ├── GuideDashboard
│       └── TravelerDashboard
```

### 🔄 Data Flow
```
Frontend Components
    ↕️
React Query (Caching)
    ↕️
Services (bookingService, paymentService)
    ↕️
Supabase Client
    ↕️
Supabase Backend (Database, Auth, Storage)
```

### 💳 Payment Flow
```
BookingCheckout
    ↕️
Stripe Components
    ↕️
Payment Service
    ↕️
Supabase Edge Functions
    ↕️
Stripe API
```

---

## 🔒 Security & Configuration Status

### 🚨 Critical Security Issues
- **Hardcoded Supabase Keys** in `src/integrations/supabase/client.ts`
- **TypeScript Strict Mode Disabled** - `strictNullChecks: false`
- **Stripe Secrets in Frontend** - `paymentService.ts` contains server-side keys
- **OpenAI API Key Exposure Risk** - Client-side access patterns

### ⚠️ Configuration Concerns
- **Missing Testing Infrastructure** - No Jest, Vitest, or Testing Library
- **No CI/CD Pipeline** - Missing GitHub Actions or similar
- **Environment Variables** - Mixed usage of `process.env` vs `import.meta.env`
- **Bundle Analysis** - No build size monitoring or optimization

### ✅ Security Strengths
- Supabase RLS policies implemented
- Role-based access control in dashboards
- Input validation with Zod schemas
- HTTPS-only Stripe integration

---

## 📈 Project Statistics

- **Total Files:** 180+ TypeScript/React files
- **Components:** 90+ reusable components (46 UI, 44+ custom)
- **Pages:** 18 route components (12 public, 6 dashboard)
- **Hooks:** 7 custom hooks
- **Services:** 3 main service modules
- **Database Tables:** 10+ tables with relationships
- **Supabase Functions:** 3 active edge functions
- **Dependencies:** 77 production packages
- **Dev Dependencies:** 20+ development tools
- **Migrations:** 12 database migration files
- **Lines of Code:** Estimated 15,000+ lines

---

## 🎯 Quick Reference Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Run ESLint

# Database
npx supabase db reset    # Reset database
npx supabase db push     # Push migrations
npx supabase gen types   # Generate TypeScript types
```

---

**Last Updated:** August 4, 2025 *(Synchronized with PROJECT_UPDATE.md)*  
**Version:** 0.0.0  
**Build Tool:** Vite 5.4.1  
**Node Version:** 18+  
**Status:** ⚠️ Functional with critical security issues requiring immediate attention  