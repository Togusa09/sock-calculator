---
name: refactor-code
description: Refactor Sock Calculator code in small, behavior-preserving steps.
---

<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/skills/refactor/SKILL.md -->

# Refactor Code

Improve readability or maintainability while preserving the existing user-visible behavior and data formats.

Ask what maintainability concern or scope the user wants addressed if it is not specified.

## Requirements

- Inspect the relevant implementation, callers, tests, and repository instructions before editing.
- Keep changes focused; do not combine unrelated feature work with a refactor.
- Preserve calculation outputs, canonical units, validation, versioned persistence, import/export compatibility, and accessible behavior.
- Prefer extracting focused responsibilities and improving types over adding layers or abstractions without need.
- Add or update tests before or alongside risky changes, then run them after each coherent refactor.
- Explain any intentional behavior change separately; do not silently change behavior under the label of refactoring.
