---
applyTo: "src/**/*.{ts,tsx,css}"
description: "Performance standards for Sock Calculator"
---

# Performance Guidelines

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Keep calculation helpers deterministic and lightweight; avoid repeating the same derivation or formatting work unnecessarily during rendering.
- Preserve Expo web export and GitHub Pages compatibility, as well as native behavior; avoid adding server requests, runtime services, or dependencies without a clear need.
- Keep component state focused, avoid unnecessary rerenders and work on the JavaScript thread, and use efficient list patterns for potentially large collections.
- Prefer existing React Native/Expo UI and styling patterns over web-only styling or new runtime packages.
- Measure before optimizing. Protect correctness and accessible responsiveness while reducing work.
