# 🏗️ BelizeVibes Project Structure & Dependencies

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Package Dependencies](#package-dependencies)
- [File Structure](#file-structure)
- [Core Application Files](#core-application-files)
- [Components Structure](#components-structure)
- [Database & Integrations](#database--integrations)
- [Build Configuration](#build-configuration)

---

## 🎯 Project Overview

**Project Name:** BelizeVibes Adventure Booking Platform  
**Framework:** React 18 + TypeScript + Vite  
**UI Library:** shadcn/ui + Radix UI  
**Backend:** Supabase (PostgreSQL + Auth + Storage)  
**Payment:** Stripe Integration  
**Styling:** Tailwind CSS  

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

#### **Utilities**
- `date-fns: ^3.6.0` - Date manipulation
- `sonner: ^1.5.0` - Toast notifications
- `cmdk: ^1.0.0` - Command palette
- `input-otp: ^1.2.4` - OTP input component
- `embla-carousel-react: ^8.3.0` - Carousel component
- `react-day-picker: ^8.10.1` - Date picker
- `react-resizable-panels: ^2.1.3` - Resizable panels
- `vaul: ^0.9.3` - Drawer component

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
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json              # App-specific TypeScript config
├── tsconfig.node.json             # Node-specific TypeScript config
├── vite.config.ts                 # Vite build configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.mjs              # ESLint configuration
├── components.json                # shadcn/ui configuration
├── README.md                      # Project documentation
├── AUTHENTICATION_SETUP.md        # Auth setup guide
├── OAUTH_SETUP.md                 # OAuth setup guide
└── setup-review-photos-bucket.md  # Storage setup guide
```

### 📱 Source Code (`src/`)
```
src/
├── main.tsx                       # Application entry point
├── App.tsx                        # Main application component
├── index.css                      # Global styles
├── vite-env.d.ts                 # Vite environment types
├── server.ts                      # Development server
├── components/                    # Reusable components
├── pages/                         # Route components
├── hooks/                         # Custom React hooks
├── contexts/                      # React contexts
├── lib/                          # Utility libraries
├── services/                     # API services
├── types/                        # TypeScript type definitions
├── data/                         # Static data
├── utils/                        # Utility functions
└── integrations/                 # Third-party integrations
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
**Dependencies:**
- `@supabase/supabase-js` - Supabase client library
- `./types` - Database type definitions

---

## 🧩 Components Structure

### 🔐 Authentication (`src/components/auth/`)
```
auth/
├── AuthProvider.tsx              # Auth context provider
├── SignInModal.tsx               # Login/signup modal
├── SignUpModal.tsx               # Signup modal (legacy)
├── RoleSelection.tsx             # Role selection modal
├── PasswordStrengthIndicator.tsx # Password validation
└── utils/
    └── passwordStrength.ts       # Password strength utility
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

---

## 📄 Pages Structure

### 🏠 Public Pages (`src/pages/`)
```
pages/
├── Index.tsx                     # Homepage
├── About.tsx                     # About page
├── Contact.tsx                   # Contact page
├── Blog.tsx                      # Blog listing
├── Safety.tsx                    # Safety information
├── AdventureDetail.tsx           # Adventure details
├── Booking.tsx                   # Booking page
├── BookingCheckout.tsx           # Checkout process
├── Confirmation.tsx              # Booking confirmation
├── NotFound.tsx                  # 404 page
├── auth/
│   └── callback.tsx              # OAuth callback
├── booking/
│   └── success.tsx               # Payment success
└── dashboard/
    ├── AdminDashboard.tsx        # Admin dashboard
    ├── GuideDashboard.tsx        # Guide dashboard
    ├── TravelerDashboard.tsx     # Traveler dashboard
    └── CreateAdventure.tsx       # Adventure creation form
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
├── use-mobile.tsx                # Mobile detection
└── use-toast.ts                  # Toast notifications
```

### 🛠️ Services (`src/services/`)
```
services/
├── bookingService.ts             # Booking API operations
└── paymentService.ts             # Payment processing
```

### 📚 Libraries (`src/lib/`)
```
lib/
├── utils.ts                      # General utilities
├── stripe.ts                     # Stripe configuration
├── storage.ts                    # Supabase Storage utilities
└── ai/
    ├── index.ts                  # AI module exports
    ├── generateDescription.ts    # AI description generation
    └── generateImage.ts          # AI image generation
```

---

## 🗄️ Database & Integrations

### 🐘 Supabase Setup (`supabase/`)
```
supabase/
├── migrations/                   # Database migrations
│   ├── 20250110_booking_system_integration.sql
│   ├── 20250710000000-booking-system-schema.sql
│   ├── 20250711000000-comprehensive-belizevibes-schema.sql
│   ├── 20250712000000-simple-testimonials-table.sql
│   ├── 20250715_admin_dashboard_analytics.sql
│   └── 20250715_test_accounts.sql
└── functions/                    # Edge Functions
    ├── create-payment-intent/
    ├── create-payment/
    ├── stripe-webhook/
    └── get_booking_analytics.sql
```

### 🔌 Integrations (`src/integrations/`)
```
integrations/
└── supabase/
    ├── client.ts                 # Supabase client configuration
    └── types.ts                  # Auto-generated database types
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

## 📈 Project Statistics

- **Total Files:** 150+ TypeScript/React files
- **Components:** 80+ reusable components
- **Pages:** 15+ route components
- **Hooks:** 10+ custom hooks
- **Services:** 2 main service modules
- **Database Tables:** 8+ tables with relationships
- **Supabase Functions:** 4 edge functions
- **Dependencies:** 50+ production packages
- **Dev Dependencies:** 20+ development tools

---

**Last Updated:** July 15, 2025  
**Version:** 0.0.0  
**Build Tool:** Vite 5.4.1  
**Node Version:** 18+  