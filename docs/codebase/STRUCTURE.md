# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path | Purpose | Evidence |
|---|---|---|
| `src/app/` | Expo Router layouts and screens: home, compact results, and configuration routes. | [`src/app/_layout.tsx`](../../src/app/_layout.tsx), [`src/app/index.tsx`](../../src/app/index.tsx) |
| `src/components/` | Shared calculator, configuration, import/export, and result UI. | [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx), [`src/components/ResultsPanel.tsx`](../../src/components/ResultsPanel.tsx) |
| `src/hooks/` | Hooks for persisted records, saved items, feature flags, and theme state. | [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts), [`src/hooks/UseLibraryItems.ts`](../../src/hooks/UseLibraryItems.ts) |
| `src/lib/` | Domain types, unit conversion, validation, calculations, construction formulas, and local library operations. | [`src/lib/domain.ts`](../../src/lib/domain.ts), [`src/lib/calculations.ts`](../../src/lib/calculations.ts) |
| `src/context/`, `src/constants/`, `src/theme/` | Feature-toggle context and theme constants. | [`src/context/FeatureToggleContext.tsx`](../../src/context/FeatureToggleContext.tsx), `src/constants/`, `src/theme/` |
| `src/__mocks__/` | Module mock for AsyncStorage used by Jest. | [`src/__mocks__/@react-native-async-storage/async-storage.js`](../../src/__mocks__/@react-native-async-storage/async-storage.js) |
| `assets/`, `content/`, `public/` | App imagery/icons, privacy-policy source, and static web assets. | [`app.json`](../../app.json), [`content/PrivacyPolicy.md`](../../content/PrivacyPolicy.md) |
| `scripts/` | Build helper for generating the static privacy-policy page. | [`scripts/build-privacy-html.mjs`](../../scripts/build-privacy-html.mjs) |
| `.github/`, `.agents/`, `docs/` | CI workflows, repository instructions/skills, and project documentation. | [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml), [`AGENTS.md`](../../AGENTS.md) |

The repository is not configured as a package-workspace monorepo. Its release target is Expo web on GitHub Pages. A separate consuming repository uses it as a submodule and handles Android/iOS builds; the local `android/` folder is excluded by `.gitignore` and is not tracked, and no `ios/` folder is present here.

### 2) Entry Points

- Main runtime entry: `expo-router/entry`, declared as `main` in [`package.json`](../../package.json).
- Root navigation/layout: [`src/app/_layout.tsx`](../../src/app/_layout.tsx).
- Main screen: [`src/app/index.tsx`](../../src/app/index.tsx).
- Other route screens: `src/app/compact/index.tsx`, `src/app/config/index.tsx`, and the foot-size and yarn-profile routes under `src/app/config/`.
- Command selection: `npm run start`, `npm run android`, `npm run ios`, and `npm run web` start Expo for the respective targets. GitHub Actions uses `npx expo export -p web` for its Pages artifact.
- Deployment ownership: GitHub Pages web export/deployment is configured in this repository; Android/iOS builds are handled by the separate repository that consumes this one as a submodule.
- No separate server, worker, or command-line entry point is declared.

### 3) Module Boundaries

| Boundary | Observed responsibility | Evidence |
|---|---|---|
| `src/app/` | Route composition, screen state, and navigation. | [`src/app/index.tsx`](../../src/app/index.tsx), [`src/app/compact/index.tsx`](../../src/app/compact/index.tsx) |
| `src/components/` | Input controls, shared saved-item UI, import/export, and result presentation. | [`src/components/SavedItemsControl.tsx`](../../src/components/SavedItemsControl.tsx), [`src/components/ResultsPanel.tsx`](../../src/components/ResultsPanel.tsx) |
| `src/hooks/` | AsyncStorage lifecycle and state access for the working record and library. | [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts), [`src/hooks/UseLibraryItems.ts`](../../src/hooks/UseLibraryItems.ts) |
| `src/lib/` | Domain data, conversion, validation, calculation, and local-library operations. | [`src/lib/domain.ts`](../../src/lib/domain.ts), [`src/lib/library.ts`](../../src/lib/library.ts) |

These are observed responsibilities, not enforced package boundaries.

### 4) Naming and Organization Rules

- Expo Router uses `_layout.tsx` and `index.tsx` route files with lowercase route directories.
- Component file naming is mixed: examples include `ResultsPanel.tsx` and `ImportExportData.tsx`, as well as `external-link.tsx` and `themed-view.tsx`.
- Domain modules use lower camel case (`calculations.ts`, `compactDetails.ts`); the persistence hooks use both `UseDataPersistence.ts` and `use-theme.ts`.
- `@/*` resolves to `src/*`; `@/assets/*` resolves to `assets/*`, as configured in `tsconfig.json`.

### 5) Evidence

- [`package.json`](../../package.json)
- [`app.json`](../../app.json)
- [`src/app/_layout.tsx`](../../src/app/_layout.tsx)
- [`src/app/index.tsx`](../../src/app/index.tsx)
- [`src/app/compact/index.tsx`](../../src/app/compact/index.tsx)
- [`tsconfig.json`](../../tsconfig.json)
- [`.gitignore`](../../.gitignore)
