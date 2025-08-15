# Claude Performance Optimization Prompt

## 🎯 TASK CONTEXT FOR CLAUDE

Copy and paste this prompt to another Claude session to continue the performance optimization work:

---

## **CONTEXT**: BelizeVibes Tourism Platform - Performance Optimization Task

**PROJECT STATUS**: 
- Production-ready React/TypeScript tourism platform (85% complete)
- Vite + React 18 + Supabase backend + Stripe payments
- Recently resolved 5-day authentication crisis, now stable
- About to add AI-generated tours/blogs content
- Bundle size: 783KB (needs optimization before content addition)

**CRITICAL BACKGROUND**:
- App is launch-ready but needs performance optimization BEFORE adding AI content
- Zero users in production = safe to optimize without data loss risk
- Recent authentication fixes make this the PERFECT time for optimization
- Must maintain all functionality while reducing bundle size 30-40%

---

## **YOUR SPECIFIC TASK**

**GOAL**: Optimize bundle size from 783KB to 500-600KB through surgical changes only

**APPROACH**: Use the `general-purpose` agent to execute the performance optimization tasks

**AVAILABLE DOCUMENTATION**:
- Read `/docs/performance-optimization-task.md` for complete detailed instructions
- Read `/CLAUDE.md` for project context and development principles
- Reference recent performance audit results from CI/CD Butler agent

---

## **EXACT PROMPT TO USE**

```
I need to optimize the performance of a production-ready React/TypeScript tourism platform called BelizeVibes. The app is stable and launch-ready, but needs bundle size optimization before adding AI-generated content.

CRITICAL CONSTRAINTS:
- This is a mature codebase (85% complete) - NO REWRITING
- Surgical optimizations only - maintain all existing functionality  
- Bundle size: 783KB → target 500-600KB (30-40% reduction)
- Zero users in production = safe optimization window

REQUIRED ACTIONS:
1. Read /docs/performance-optimization-task.md for complete instructions
2. Read /CLAUDE.md for project context and guardrails
3. Use general-purpose agent to execute the optimization tasks

SPECIFIC TASKS:
1. Bundle splitting: Lazy load DashboardCharts (384KB) and BlogForm (357KB) 
2. Image optimization: Add loading="lazy" to 14+ image components
3. React performance: Add React.memo to list components

GUARDRAILS:
- Only wrap existing code, don't modify logic
- Test all critical paths after each change
- Document bundle size improvements
- Rollback if ANY functionality breaks

SUCCESS CRITERIA:
- Bundle reduced to 500-600KB range
- All existing functionality preserved
- Admin portal fully functional
- Ready for AI content addition

Please execute these optimizations following the detailed task instructions.
```

---

## **CONTEXT FILES TO READ FIRST**

1. **`/docs/performance-optimization-task.md`** - Complete detailed instructions with guardrails
2. **`/CLAUDE.md`** - Project context, development principles, and agent guidelines  
3. **`/CHANGELOG.md`** - Recent authentication crisis resolution context

---

## **EXPECTED OUTCOME**

After Claude completes the task:
- ✅ Bundle size reduced by 30-40%
- ✅ All functionality preserved
- ✅ Admin authentication still working
- ✅ Performance optimizations documented
- ✅ App ready for AI content addition

---

## **HANDOFF CHECKLIST**

**Before starting new Claude session:**
- [ ] Ensure all recent commits are pushed
- [ ] Current branch is clean (no uncommitted changes)
- [ ] Documentation files are up to date
- [ ] Performance baseline is documented

**After Claude completes optimization:**
- [ ] Verify bundle size reduction achieved
- [ ] Test all critical user paths
- [ ] Admin portal authentication works
- [ ] No console errors or warnings
- [ ] Performance results documented

---

## **SAFETY NET**

**If optimization breaks anything:**
1. Immediately rollback: `git checkout HEAD~1`
2. Document what broke in detail
3. Retry with more conservative approach
4. Do not push broken code

**The app is production-ready and stable - keep it that way.**