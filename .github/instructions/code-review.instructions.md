---
applyTo: "**/*"
description: "Code review standards for Sock Calculator"
---

# Code Review Standards

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Prioritize actionable defects: incorrect calculations or units, broken validation or persistence, hydration issues, inaccessible controls, static-export regressions, and missing tests.
- Report findings with severity, file and line, the triggering condition, and concrete user or maintenance impact. Distinguish confirmed defects from questions or suggestions.
- Check that changes preserve current product scope, versioned data compatibility, canonical centimetres, and GitHub Pages deployment behavior.
- Review tests and documentation alongside implementation. Do not request cosmetic changes that conflict with repository conventions.
- Do not modify code while performing a review unless the user explicitly asks for fixes.
