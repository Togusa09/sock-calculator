# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item | Observed rule | Example | Evidence |
|---|---|---|---|
| Routes | Expo Router special filenames and lowercase route folders. | `src/app/index.tsx`, `src/app/config/foot-sizes/index.tsx` | [`src/app/_layout.tsx`](../../src/app/_layout.tsx) |
| Components and component types | Component symbols and many component files use PascalCase; some starter utilities use kebab-case. | `ResultsPanel`, `ImportExportData`, `external-link.tsx` | [`src/components/ResultsPanel.tsx`](../../src/components/ResultsPanel.tsx), [`src/components/external-link.tsx`](../../src/components/external-link.tsx) |
| Functions and variables | Generally camelCase. | `calculateStitches`, `useDataPersistence` | [`src/lib/calculations.ts`](../../src/lib/calculations.ts), [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts) |
| Types | PascalCase. | `CalculatorRecord`, `ConstructionOptions` | [`src/lib/domain.ts`](../../src/lib/domain.ts) |
| Constants | Upper snake case for shared fixed values; local constants also appear in camelCase. | `DEFAULT_RECORD`, `STORAGE_KEY` | [`src/lib/domain.ts`](../../src/lib/domain.ts), [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts) |

File naming is not fully uniform: hook files include both `UseDataPersistence.ts` and `use-theme.ts`.

### 2) Formatting and Linting

- Linter: ESLint 9 with `eslint-config-expo/flat`, invoked by `npm run lint`.
- TypeScript: strict mode is enabled; aliases map `@/*` to `src/*` and `@/assets/*` to `assets/*`.
- Prettier is a declared dependency, but no format script or Prettier configuration was found.
- CI runs Expo lint, but has no explicit `tsc --noEmit` step.
- Commands: `npm run lint`, `npx tsc --noEmit`; CI runs tests with `npm test -- --watchAll=false --ci`.

### 3) Import and Module Conventions

- Source uses package imports, `@/` aliases, and relative imports.
- No import-order rule or sorting plugin is configured in the inspected lint/package configuration; `[TODO]` confirm whether additional editor-only rules exist.
- Modules are imported directly from their files in the representative source; no shared barrel convention is evident.

### 4) Error and Logging Conventions

- Domain validation returns arrays of user-facing strings; `parseImportedRecord` throws on JSON parse or validation errors.
- The persistence hook removes an unreadable active record after restore without reporting the failure in the UI.
- `listItems` returns an empty list for invalid JSON or a non-array stored value; AsyncStorage operation failures are not consistently surfaced.
- `ImportExportData` catches errors and logs them; the `onError` prop is declared but not called. The home route also logs the full imported data object.
- Repository security guidance says not to log measurement records; see [`CONCERNS.md`](./CONCERNS.md).
- No application logging library or structured logging convention was found.

### 5) Testing Conventions

- Test filenames use `.test.ts` or `.test.tsx` and are generally colocated with the code under test.
- Jest assertions and mocks are used; component suites use `@testing-library/react-native`.
- The AsyncStorage mock forwards to the package's Jest mock; storage is cleared in relevant suites.
- Current test tooling is Jest/`jest-expo`, despite stale repository instructions that still specify Vitest; see [`TESTING.md`](./TESTING.md).

### 6) Evidence

- [`package.json`](../../package.json)
- [`tsconfig.json`](../../tsconfig.json)
- [`eslint.config.js`](../../eslint.config.js)
- [`jest.config.ts`](../../jest.config.ts)
- [`src/lib/validation.ts`](../../src/lib/validation.ts)
- [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx)
- [`src/app/index.tsx`](../../src/app/index.tsx)
- [`.github/instructions/security.instructions.md`](../../.github/instructions/security.instructions.md)
