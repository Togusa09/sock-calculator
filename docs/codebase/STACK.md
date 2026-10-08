# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area                | Value                                                                                                      | Evidence                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Primary language    | TypeScript; `typescript` is declared as `^5`                                                               | `package.json`, `tsconfig.json`                           |
| Runtime + version   | Node.js 20 in GitHub Actions; no local runtime version is pinned in a root version file or `engines` field | `.github/workflows/deploy-pages.yml`, `package.json`      |
| Package manager     | npm; lockfile version 3 and CI uses `npm ci`                                                               | `package-lock.json`, `.github/workflows/deploy-pages.yml` |
| Module/build system | Next.js 16 App Router, TypeScript ES modules, Next static export                                           | `package.json`, `tsconfig.json`, `next.config.ts`         |

### 2) Production Frameworks and Dependencies

| Dependency  | Version  | Role in system                                 | Evidence                         |
| ----------- | -------- | ---------------------------------------------- | -------------------------------- |
| `next`      | `16.3.4` | App Router, rendering, and static export build | `package.json`, `next.config.ts` |
| `react`     | `19.2.8` | UI component and client state runtime          | `package.json`                   |
| `react-dom` | `19.2.8` | React DOM rendering                            | `package.json`                   |

No production database, API client, authentication package, or persistence package is declared. Browser storage is accessed through the built-in `window.localStorage` API.

### 3) Development Toolchain

| Tool                                              | Purpose                                                     | Evidence                             |
| ------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ |
| TypeScript `^5`                                   | Static type checking; strict mode enabled                   | `package.json`, `tsconfig.json`      |
| ESLint `^9` and `eslint-config-next` `16.3.4`     | Linting with Next.js core web vitals and TypeScript presets | `package.json`, `eslint.config.mjs`  |
| Prettier `^3.9.6`                                 | Formatting source files                                     | `package.json`                       |
| Vitest `^4.1.11` and jsdom `^29.1.1`              | Unit and DOM/component tests                                | `package.json`, `vitest.config.ts`   |
| Tailwind CSS `^4` and `@tailwindcss/postcss` `^4` | Styling and CSS processing                                  | `package.json`, `postcss.config.mjs` |

### 4) Key Commands

```bash
npm install
npm run dev
npm run format:check
npm run lint
npm test
npx tsc --noEmit
npm run build
```

### 5) Environment and Config

- Config sources: `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`.
- Required environment variables: none identified.
- Optional environment variable: `PAGES_BASE_PATH` sets the Next.js base path; the Pages workflow sets it to `/sock-calculator`.
- Deployment/runtime constraints: Next.js is configured for `output: "export"` with trailing slashes. GitHub Pages builds run on Node.js 20.
- No `.env.example`, `.env.template`, or container configuration was found.

### 6) Evidence

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `.github/workflows/deploy-pages.yml`
