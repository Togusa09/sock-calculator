# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path              | Purpose                                                                                 | Evidence                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/app/`        | Next.js routes, root layout, and global styles                                          | `src/app/`                                                                                                       |
| `src/components/` | Shared calculator, compact-view, and configuration UI                                   | `src/components/`                                                                                                |
| `src/hooks/`      | Browser persistence and saved-library hooks                                             | `src/hooks/`                                                                                                     |
| `src/lib/`        | Domain types, calculation logic, unit conversion, validation, and library storage       | `src/lib/`                                                                                                       |
| `public/`         | Static public assets                                                                    | `public/`                                                                                                        |
| `docs/`           | Product design and codebase documentation                                               | `docs/design.md`, `docs/codebase/`                                                                               |
| `.github/`        | GitHub Actions, Copilot guidance, skills, and agent definitions                         | `.github/`                                                                                                       |
| `.agents/`        | Repository-local agent skills                                                           | `.agents/skills/`                                                                                                |
| Root config files | Package scripts/dependencies and Next.js, TypeScript, ESLint, PostCSS, and Vitest setup | `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.ts` |

Generated directories such as `node_modules/`, `.next/`, and `out/` are build/dependency artifacts rather than source modules.

### 2) Entry Points

- Main runtime entry: `src/app/page.tsx`, the `/` calculator route.
- Secondary routes: `src/app/compact/page.tsx` (`/compact`), `src/app/config/page.tsx` (`/config`), and nested foot-size and yarn-profile routes.
- Root layout and document metadata: `src/app/layout.tsx`.
- Build entry selection: Next.js App Router route files; `npm run dev` starts development mode and `npm run build` creates the static export.
- No separate worker, CLI, or backend entry point was found.

### 3) Module Boundaries

| Boundary          | What belongs here                                                                      | What must not be here                                           |
| ----------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `src/app/`        | Route composition, page-level state, route metadata                                    | Reusable domain calculations                                    |
| `src/components/` | Forms, wizard navigation, result presentation, saved-item controls                     | Persistence schema decisions or duplicated calculation formulas |
| `src/hooks/`      | Client-side loading and persistence lifecycle                                          | Sock calculation formulas                                       |
| `src/lib/`        | Domain types, calculations, validation, unit conversions, and local library operations | Route layout and presentational markup                          |

These are observed responsibilities, not enforced package boundaries.

### 4) Naming and Organization Rules

- Route files use Next.js names such as `page.tsx` and `layout.tsx`; route folders are lowercase.
- React components and component files are generally PascalCase, for example `ResultsPanel.tsx`.
- Domain modules use camelCase filenames, for example `calculations.ts` and `validation.ts`.
- Hook functions use camelCase (`useDataPersistence`, `useLibraryItems`), while the current hook filenames are `UseDataPersistence.ts` and `UseLibraryItems.ts`.
- `tsconfig.json` maps `@/*` to the repository root. Source imports commonly use that alias, with some relative imports also present.

### 5) Evidence

- `src/app/page.tsx`
- `src/app/compact/page.tsx`
- `src/app/config/`
- `src/components/`
- `src/hooks/`
- `src/lib/`
- `tsconfig.json`
