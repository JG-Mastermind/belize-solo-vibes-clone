# Claude Code Agent Creation Guide & Troubleshooting

## ⚠️ CRITICAL: How to Create Agents Properly

**DO**: Use Claude Code's `/agents` command interface
**DON'T**: Manually create .md files in `.claude/agents/`

## Problem Discovered (Aug 16, 2025)

Manually creating agent files in `.claude/agents/` directory does NOT properly register them with Claude Code's agent system.

### What Happened:
- Created `image-ai-content-optimizer.md` manually with proper YAML frontmatter
- File existed and was properly formatted
- Agent was NOT recognized by Claude Code
- Terminal errors: `Agent type 'image-ai-content-optimizer' not found`

### Root Cause:
Claude Code requires agents to be created through its interface for proper registration, not just file placement.

## ✅ Correct Process:

1. Run `/agents` in Claude Code terminal
2. Use the interactive interface to create new agent
3. Claude Code handles registration automatically
4. Success message: `Created agent: [agent-name]`

## 🚫 Incorrect Process:

1. ~~Manually create .md file in `.claude/agents/`~~
2. ~~Write YAML frontmatter and agent definition~~
3. ~~Agent file exists but system doesn't recognize it~~

## Key Technical Insights:

- **File ≠ Registration**: Having a properly formatted file doesn't equal having a registered agent
- **Internal Validation**: Claude Code has internal validation/registration during agent creation
- **Error Proof**: Terminal shows definitive "Agent not found" errors for unregistered agents
- **Interface Required**: The `/agents` command triggers proper system registration

## Agent File Format (for reference):

```markdown
---
name: agent-name
description: Agent description with examples
model: sonnet
---

Agent system prompt and instructions...
```

## Changelog:

**Aug 16, 2025**: Discovered agent registration requirement
- Issue: Manual file creation doesn't register agents
- Solution: Use `/agents` interface for proper registration
- Result: `image-ai-content-optimizer` successfully created and functional

## Future Reference:

Always use Claude Code's built-in `/agents` interface to create new agents rather than manually creating files. This ensures proper system registration and functionality.