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
- to memorize