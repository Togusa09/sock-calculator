---
name: code-review
description: Review Sock Calculator changes for correctness, data integrity, accessibility, and deployment regressions.
---

<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/skills/review-and-refactor/SKILL.md -->

# Code Review

Review the requested change against repository conventions and report actionable findings without modifying code.

Ask for the target branch, commit, or file range if the review scope is unclear.

## Requirements

- Read repository and path-specific Copilot instructions, then inspect the complete changed context.
- Prioritize user-impacting defects, especially unit conversion, stitch calculations, invalid imported data, local storage, React hydration, accessibility, and static export.
- Check changed tests and documentation and identify important untested behavior.
- Present findings first, ordered by severity; include file and line, reproduction condition, and impact.
- Do not report speculative concerns as confirmed defects, and do not make edits unless explicitly requested.
