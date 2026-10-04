---
name: debug-issue
description: Trace and resolve Sock Calculator defects using reproducible evidence and focused validation.
---

<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/agents/debug.agent.md -->

# Debug an Issue

Find the cause of a reported defect, implement a focused fix when requested, and verify it with relevant tests.

Ask for missing reproduction details, expected behavior, or environment information when necessary.

## Requirements

- Reproduce the issue or establish a failing test before selecting a fix where practical.
- Trace the behavior through its route, component, domain helper, and persistence boundaries as relevant.
- Check browser/server rendering boundaries and stored or imported data when the defect involves client state.
- Fix the root cause with the smallest coherent change; avoid silent fallbacks or broad exception handling.
- Add a regression test that fails before the fix when practical.
- Run the targeted test and the relevant lint, formatting, type, and build checks; report any check that could not run.
