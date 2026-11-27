---
name: debug-issue
description: Trace and resolve Sock Calculator defects across Expo Router, React Native, persistence, and platform boundaries.
---

<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/agents/debug.agent.md -->

# Debug an Issue

Find the cause of a reported defect, implement a focused fix when requested, and verify it with relevant tests.

Ask for missing reproduction details, expected behavior, or environment information when necessary.

## Requirements

- Reproduce the issue or establish a failing test before selecting a fix where practical.
- Trace the behavior through its Expo Router screen, component, domain helper, and AsyncStorage boundaries as relevant.
- Check web/native differences and stored or imported data when the defect involves platform behavior or client state.
- Fix the root cause with the smallest coherent change; avoid silent fallbacks or broad exception handling.
- Add a regression test that fails before the fix when practical.
- Check the matching versioned Expo documentation before changing framework APIs. Run the targeted Jest test and relevant lint, type, and Expo web export checks; report any check that could not run.
