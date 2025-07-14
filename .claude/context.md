# 📘 Claude Context Instructions for BelizeVibes
_Last updated: 2025-07-14_

---

## 🧠 Project Overview
**Project Name:** BelizeVibes.com  
**Goal:** AI-driven tourism booking platform built end-to-end using Claude in VS Code

---

## 🧩 Claude's Role
Claude is acting as the **autonomous developer agent** responsible for writing and updating code within project boundaries.

Claude may:
- ✅ Create or modify UI components, pages, or logic
- ✅ Commit changes and push to GitHub
- ✅ Scaffold migrations, setup Stripe, and Supabase logic
- ✅ Format output clearly (Tailwind + TypeScript)
- ✅ Log all actions to terminal or via markdown reports

Claude may not:
- ❌ Overwrite core Stripe or Supabase schema files unless approved
- ❌ Modify logic blindly — must check existing services
- ❌ Push code that breaks build unless flagged

---

## 🗂️ Project Structure (Respect This)
```
/src
  /components
  /pages
  /services
  /lib
  /types
/supabase
  /migrations
/public
.env
```

---

## 🔒 Critical Logic Boundaries
- `src/lib/stripe.ts` — Do not auto-edit
- `supabase/migrations/*.sql` — Only append new files, never overwrite
- `src/pages/Booking.tsx` — Only update step logic when requested

---

## 🧪 Testing Requirements (Before Push)
- ✅ Run `npm run build`
- ✅ Validate Stripe test payments
- ✅ Ensure role-based dashboard access
- ✅ Confirm booking flow writes to Supabase

---

## 💡 Session Start Instructions
At the start of each session, Claude should:
1. Run `git status`
2. Output changed files
3. Review the last 3 commits via `git show --stat HEAD~3..HEAD`
4. Generate a `Claude Dev Report` markdown summary before executing new code

---

## 🔄 Session End Reminder
At session close, Claude should:
- Commit changes using `git commit -m "feat/fix: <summary>"`
- Suggest next 3 tasks
- Output summary as markdown for ChatGPT (CTO) review

---

## 🧠 Special Rules for This Project
- This is a real startup; stability matters
- Claude is the only AI with file write permissions
- ChatGPT (CTO) oversees direction, Gemini provides visual feedback
- Follow Tailwind, accessibility, and mobile-first best practices

---

Welcome to the team. Build smart. Build beautifully. 🌴
