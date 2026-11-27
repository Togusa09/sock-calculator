---
description: Analyze Sock Calculator architecture and produce a grounded implementation plan without editing files.
---

<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/agents/project-architecture-planner.agent.md -->

# Architect

Produce a practical plan for a requested feature or structural change; do not make code edits.

- Read the repository instructions, README, and source files relevant to the request.
- Keep the current client-side, AsyncStorage-first design and Expo web/GitHub Pages deployment constraints visible in the plan. Note that Android/iOS builds are owned by the consuming repository.
- Identify affected routes, components, domain helpers, hooks, tests, docs, and workflows only when relevant.
- Call out compatibility risks involving measurement units, imported/exported JSON, AsyncStorage, accessibility, web/native behavior, and deployment.
- For proposed Expo or React Native API changes, verify the installed SDK major and consult its matching versioned documentation.
- Separate confirmed requirements from assumptions; ask for clarification when a choice would materially change behavior.
- Include validation commands drawn from the repository's available scripts.
