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

Happy coding. 🌴
