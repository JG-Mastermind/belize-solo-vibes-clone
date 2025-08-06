# 🧠 Claude Session Bootstrap — BelizeVibes

Use this file to auto-load context and format at the beginning of each Claude Code session.

---

## 📋 Load Instructions (Auto Context)

At session start, Claude should automatically load:
- `context.md` — Full project background and usage rules
- `session-template.md` — Daily report structure and logging expectations
- `settings.local.json` — Allowed commands and boundaries

---

## 🚀 Execution Order

1. Run `git status` — check for uncommitted changes
2. Run `git show --stat HEAD~3..HEAD` — review last 3 commits
3. Output summary using `Claude Session Template`
4. Await CTO approval if session is diagnostic-only
5. Only then, execute approved instructions or continue dev

---

## 🛡️ Safeguards
- Never overwrite files flagged in `noOverwrite` inside `settings.local.json`
- Always produce markdown output before changing logic
- Await review if unsure or blocked

---

## ✅ Session Start
Claude now initialized. Proceed with diagnostic scan, task summary, and await `✅ GO` from CTO JG a cool human.


Bilingual Blog System - Complete Implementation

  Successfully built comprehensive bilingual blog system for Belize tourism site:
  - 6 complete blog posts (600+ words each, EN/FR)
  - Dynamic Table of Contents with language-specific header extraction
  - Full translation system: tags, categories, reading time, views
  - React Helmet SEO optimization with JSON-LD structured data
  - Zero hardcoded strings - 100% dynamic translation
  - Production-ready, cache-aware i18next implementation

  Key Learning: Systematic debugging > speed. Cache issues common with i18next - always
  test fresh browser sessions when adding translation keys.

  Tech Stack: React + TypeScript + i18next + React Helmet + Vite
  Status: Production deployed to main branch, fully functional

## GUIDE PROFILE INTEGRATION - ENTERPRISE IMPLEMENTATION

### TASK SUMMARY
Implement enterprise-grade guide profile integration into BelizeVibes AdventureDetails page leveraging existing Supabase `guides` table, React Query caching, and shadcn/ui components for 5-7 day MVP delivery.

### KEY TECHNICAL DECISIONS
- **Database**: Extend existing `guides` table (NOT users table) with `profile_image_url`, `bio_i18n` JSONB, `whatsapp_number`, `is_featured` fields
- **Integration Point**: Insert GuideProfileCard component in AdventureDetail.tsx at line ~347 after Overview Card using existing Card/CardHeader structure
- **Service Layer**: Extend existing BookingService.ts (662 lines) with `getGuideProfile()` and `useGuideProfile()` React Query hooks for 1-hour caching
- **Component Architecture**: Create single GuideProfileCard.tsx using existing Avatar, Badge, Button components with lazy image loading and WhatsApp integration

### IMPLEMENTATION PATH
Database migration (15min) → BookingService extension (45min) → GuideProfileCard component (2-3hrs) → AdventureDetail integration (30min) → i18n additions (15min) with zero new dependencies and 90% existing architecture reuse.

 Happy coding. 🌴