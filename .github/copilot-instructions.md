# Sock Calculator — Copilot Instructions

## Project Overview

Sock Calculator is a browser-based tool that turns foot measurements and yarn tension into a starting stitch plan. It stores user data in browser local storage, uses centimetres as its canonical measurement, and supports metric and imperial input and display.

## Tech Stack

- TypeScript, React 19, and Next.js 16 App Router
- Tailwind CSS 4
- Vitest 4 with jsdom for unit and component tests
- ESLint 9 and Prettier 3
- Static export deployed to GitHub Pages; Node.js 20 in CI

## Conventions

- **Naming:** Use PascalCase for React components and types, camelCase for functions and variables, and follow existing filenames and route naming in `src/`.
- **Structure:** Routes live in `src/app/`; reusable UI in `src/components/`; domain logic and validation in `src/lib/`; browser persistence hooks in `src/hooks/`. Keep calculations independent of UI where practical.
- **Rendering:** Preserve Next.js server/client boundaries. Components using hooks, browser APIs, or local storage must remain client-side; avoid accessing browser globals during server rendering.
- **Data and errors:** Keep centimetres as the canonical unit and preserve the versioned JSON import/export format. Validate imported and persisted data at the boundary, and follow established user-facing validation and error patterns rather than hiding failures.
- **Scope:** This is a client-side calculator, not a server-backed account or multi-project system. Do not add server services or expand product behavior without an explicit requirement.
- **UI:** Prefer small, focused components, explicit typed props, and readable multiline JSX. Use the existing Tailwind styling and responsive patterns.

## Workflow

- Use short, descriptive branches and commits; no stricter branch or commit naming scheme is established in this repository.
- Pull requests should explain the user-visible change and list the validation run.
- Run `npm run format:check`, `npm run lint`, `npm test`, `npx tsc --noEmit`, and `npm run build` when the change warrants the full check set.
- Read the relevant installed Next.js guide under `node_modules/next/dist/docs/` before relying on unfamiliar or changed Next.js APIs.
- Apply the detailed guidance in:
  - [TypeScript and Next.js guidelines](instructions/typescript.instructions.md)
  - [Testing guidelines](instructions/testing.instructions.md)
  - [Security guidelines](instructions/security.instructions.md)
  - [Documentation guidelines](instructions/documentation.instructions.md)
  - [Performance guidelines](instructions/performance.instructions.md)
  - [Code review guidelines](instructions/code-review.instructions.md)
