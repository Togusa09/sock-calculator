# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item                              | Rule                                                                 | Example                                       | Evidence                                               |
| --------------------------------- | -------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| Route files                       | Next.js lowercase route filenames                                    | `src/app/page.tsx`                            | `src/app/`                                             |
| UI component files and components | Generally PascalCase                                                 | `ResultsPanel.tsx`, `ResultsPanel`            | `src/components/ResultsPanel.tsx`                      |
| Domain modules and functions      | Generally camelCase                                                  | `calculations.ts`, `calculateStitches`        | `src/lib/calculations.ts`                              |
| Types                             | PascalCase                                                           | `CalculatorRecord`, `Measurements`            | `src/lib/domain.ts`                                    |
| Constants                         | Uppercase words with underscores                                     | `DEFAULT_RECORD`, `STORAGE_KEY`               | `src/lib/domain.ts`, `src/hooks/UseDataPersistence.ts` |
| Hook functions/files              | Function names use `use` + camelCase; current filenames use `Use...` | `useDataPersistence`, `UseDataPersistence.ts` | `src/hooks/UseDataPersistence.ts`                      |

### 2) Formatting and Linting

- Formatter: Prettier 3 (`npm run format` / `npm run format:check`); the current scripts target `src`.
- Linter: ESLint 9 with Next.js core-web-vitals and TypeScript presets (`eslint.config.mjs`).
- TypeScript: `strict: true`, `noEmit: true`, `allowJs: true`, and bundler module resolution (`tsconfig.json`).
- Run commands: `npm run format:check`, `npm run lint`, `npx tsc --noEmit`.
- No separate Prettier configuration file was found.

### 3) Import and Module Conventions

- Imports use both external package imports and project imports; no enforced ordering rule or import-sorting plugin was found.
- The TypeScript alias `@/*` resolves from the repository root. Alias imports and relative imports both occur in source.
- No barrel-export convention was found; modules are imported from their concrete file paths.

### 4) Error and Logging Conventions

- Domain validators return arrays of user-facing error strings; imported record parsing throws when parsing or validation fails.
- The main page catches import failures and reports the error through a status notice. The persistence hook removes an unreadable/invalid saved record rather than surfacing a notice.
- No logging library or application logging convention was found in `src/`.
- The project security instructions require keeping measurement data out of logs and validating untrusted imported/persisted data (`.github/instructions/security.instructions.md`).

### 5) Testing Conventions

- Test files use `*.test.ts` or `*.test.tsx` and are colocated with their target modules where practical.
- Pure calculation and conversion tests use Vitest assertions; UI tests use jsdom and React DOM, with local storage reset between tests.
- `vitest.setup.ts` supplies a localStorage mock. Some component tests mock `next/link`.
- No coverage threshold or coverage command is configured.

### 6) Evidence

- `eslint.config.mjs`
- `tsconfig.json`
- `package.json`
- `vitest.config.ts`
- `vitest.setup.ts`
- `.github/instructions/typescript.instructions.md`
- `.github/instructions/testing.instructions.md`
- `.github/instructions/security.instructions.md`
