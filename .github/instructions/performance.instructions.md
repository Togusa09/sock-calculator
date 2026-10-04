---
applyTo: "src/**/*.{ts,tsx,css}"
description: "Performance standards for Sock Calculator"
---

# Performance Guidelines

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Keep calculation helpers deterministic and lightweight; avoid repeating the same derivation or formatting work unnecessarily during rendering.
- Preserve static-export compatibility and avoid adding server requests, runtime services, or client-side dependencies without a clear need.
- Keep client components focused so browser-only state and hooks do not spread across otherwise static UI.
- Prefer existing Tailwind utilities and small, targeted UI changes over heavy runtime styling or new packages.
- Measure before optimizing. Protect correctness and accessible responsiveness while reducing work.
