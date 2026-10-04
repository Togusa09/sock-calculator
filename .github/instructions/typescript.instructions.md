---
applyTo: "src/**/*.{ts,tsx}"
description: "TypeScript, React, and Next.js standards for Sock Calculator"
---

<!-- Based on: https://github.com/github/awesome-copilot/blob/main/instructions/nextjs.instructions.md -->

# TypeScript, React, and Next.js

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Preserve strict typing; model domain concepts explicitly and avoid weakening types with `any` or unchecked assertions.
- Follow the existing App Router structure: route files belong in `src/app/`, shared UI in `src/components/`, domain logic in `src/lib/`, and browser persistence hooks in `src/hooks/`.
- Prefer server components by default. Keep hook-based interactivity and browser APIs in client components, and avoid reading browser globals during server rendering or initial hydration.
- Keep calculation and validation logic separate from presentation. Preserve centimetres as the canonical unit and validate data when it crosses import, persistence, or UI boundaries.
- Use focused components, explicit prop types, descriptive names, and the repository's existing export and file-naming conventions.
- Read the installed Next.js documentation under `node_modules/next/dist/docs/` before using APIs whose behavior may have changed between Next.js versions.
- Format JSX and HTML as readable multiline markup; use the established Tailwind CSS 4 conventions.
