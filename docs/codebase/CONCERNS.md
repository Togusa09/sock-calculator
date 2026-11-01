# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|---|---|---|---|---|
| Medium | Imported JSON is checked for an object and `schemaVersion`, then cast to `CalculatorRecord`; nested fields are not structurally validated before access. | [`src/lib/validation.ts`](../../src/lib/validation.ts), [`src/lib/validation.test.ts`](../../src/lib/validation.test.ts) | Malformed but parseable input can throw during validation instead of producing a controlled validation result. | Validate unknown object shape and add malformed nested-object tests. |
| Medium | The home route logs the full imported record, contrary to the security instruction not to log measurement data. | [`src/app/index.tsx`](../../src/app/index.tsx), [security instructions](../../.github/instructions/security.instructions.md) | User measurements and yarn details can appear in captured development/runtime logs. | Remove payload logging; log only non-sensitive status if needed. |
| Medium | Some contributor instructions still describe Next.js/Vitest and scripts absent from the current Expo/Jest manifest. | [Copilot instructions](../../.github/copilot-instructions.md), [testing instructions](../../.github/instructions/testing.instructions.md), [`package.json`](../../package.json) | Contributors may follow invalid commands or make changes against the wrong app architecture. | Align the remaining repository instructions with the confirmed Expo web scope. |
| Low | The saved-library `persist` helper does not await `AsyncStorage.setItem`. | [`src/lib/library.ts`](../../src/lib/library.ts) | Callers can receive success before the write settles, and a rejected write is not reported through the save flow. | Await persistence and define a visible error path. |
| Low | CI exports web and runs lint/tests but does not explicitly type-check or report coverage. | [Pages workflow](../../.github/workflows/deploy-pages.yml), [`package.json`](../../package.json) | Type errors outside lint coverage and test gaps may not be caught by the configured pipeline. | Add a dedicated type-check/coverage step if required by project policy. |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|---|---|---|---|---|
| Stale contributor instructions | Several `.github` instruction files retain Next.js/Vitest descriptions from an earlier stack; current manifest and source use Expo Router/Jest. The README now documents the Expo web and GitHub Pages target. | [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md), [testing instructions](../../.github/instructions/testing.instructions.md), [`README.md`](../../README.md) | New contributors may follow mismatched implementation rules. | Update the remaining outdated instruction files. |
| Shallow import/persisted-data validation | `parseImportedRecord` checks object/version and then relies on typed field access; `validateRecord` assumes nested objects are present. | [`src/lib/validation.ts`](../../src/lib/validation.ts) | Invalid stored or imported data may fail through incidental runtime errors. | Add runtime shape guards for every persisted/imported boundary. |
| Parallel import/export paths | The UI implements Expo-specific file handling while `src/lib/platform.ts` defines a separate helper with no current call site. | [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx), [`src/lib/platform.ts`](../../src/lib/platform.ts) | Behavior and error handling can drift between paths. | Confirm whether the helper is intended to be used or removed. |

### 3) Security Concerns

| Risk | OWASP category | Evidence | Current mitigation | Gap |
|---|---|---|---|---|
| Imported record data is logged to the console. | N/A | [`src/app/index.tsx`](../../src/app/index.tsx), [security instructions](../../.github/instructions/security.instructions.md) | No external logging service is declared. | The record log includes user data and conflicts with repository policy; remove or redact it. |
| Imported JSON is not fully shape-validated before typed use. | N/A | [`src/lib/validation.ts`](../../src/lib/validation.ts), [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx) | JSON parsing and some domain checks are performed. | Validate nested shapes before fields are read or cast. |
| Local records are stored through AsyncStorage. | N/A | [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts), [`src/lib/library.ts`](../../src/lib/library.ts) | Data remains in app-local storage; no backend sync is declared. | `[TODO]` Confirm whether the intended product requires encryption or additional retention controls. |
| Environment files exist but were not inspected. | N/A | Root `.env.development` and `.env.production`; [`src/context/FeatureToggleContext.tsx`](../../src/context/FeatureToggleContext.tsx) | No credential service is declared by the manifest. | Their variable names, values, and secret handling remain unverified; do not infer that they are safe or secret-free. |

The separate [`docs/SECURITY-REVIEW.md`](../SECURITY-REVIEW.md) is retained as an archived historical review. Its stack-specific conclusions have not been revalidated for this codebase.

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---|---|---|---|---|
| No profiling, benchmark, or load-test configuration was found in the repository scan. | [`package.json`](../../package.json), [Pages workflow](../../.github/workflows/deploy-pages.yml) | `[TODO]` No measured performance baseline is available. | `[TODO]` Expected device range and saved-library size are not documented. | Measure user-visible behavior before adding optimization work. |
| Saved library reads parse an entire category array from AsyncStorage. | [`src/lib/library.ts`](../../src/lib/library.ts) | No performance problem was established. | Large saved arrays could increase read/parse time; expected size is unknown. | `[TODO]` Establish expected data volume before changing storage design. |

### 5) Fragile/High-Churn Areas

The following paths had the highest observed 90-day change counts in `git log` output; churn indicates change frequency, not a confirmed defect.

| Area | Why fragile | Churn signal | Safe change strategy |
|---|---|---:|---|
| `package.json` / `package-lock.json` | Expo, test, and build dependencies/scripts changed repeatedly. | 21 / 15 changes | Change the manifest and lockfile together; verify Expo compatibility and CI. |
| `.github/workflows/deploy-pages.yml` | Web export/deploy pipeline changed repeatedly. | 9 changes | Preserve the artifact path and deployment conditions; validate the workflow command. |
| `src/app/globals.css` | Styling had frequent edits during the app transition. | 8 changes | Check both responsive web rendering and native-compatible UI usage. |
| `src/lib/library.ts` and `src/lib/library.test.ts` | Persistence behavior and its tests are active areas. | 6 / 7 changes | Keep storage keys and saved-item schema behavior covered by tests. |
| `src/hooks/UseDataPersistence.ts` | Working-record persistence has changed repeatedly. | 6 changes | Test hydration, invalid stored data, and write failures when editing. |

### 6) `[ASK USER]` Questions

No unresolved questions. The project owner clarified that this repository deploys Expo web to GitHub Pages and is consumed as a submodule by a separate repository that handles Android/iOS builds.

### 7) Intent vs. Reality

- **Confirmed deployment intent:** This repository's release target is Expo web on GitHub Pages; a separate submodule consumer owns Android/iOS builds (project-owner clarification).
- **Current implementation:** [`package.json`](../../package.json), [`app.json`](../../app.json), and `src/app/` show an Expo Router application with a web export; the Pages workflow runs `npx expo export -p web`.
- **Contributor-guidance mismatch:** `.github/copilot-instructions.md`, `.github/instructions/typescript.instructions.md`, and `.github/instructions/testing.instructions.md` still describe Next.js and/or Vitest; the manifest and Jest config specify Expo and Jest. `AGENTS.md` describes Expo.
- **CI runtime mismatch:** the Pages workflow selects Node 24, while the separate Copilot setup workflow selects Node 20; the package does not pin a local Node version.

### 8) Evidence

- [`README.md`](../../README.md)
- [`AGENTS.md`](../../AGENTS.md)
- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)
- [`.github/instructions/typescript.instructions.md`](../../.github/instructions/typescript.instructions.md)
- [`.github/instructions/testing.instructions.md`](../../.github/instructions/testing.instructions.md)
- [`.github/instructions/security.instructions.md`](../../.github/instructions/security.instructions.md)
- [`package.json`](../../package.json)
- [`app.json`](../../app.json)
- [`src/lib/validation.ts`](../../src/lib/validation.ts)
- [`src/lib/library.ts`](../../src/lib/library.ts)
- [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts)
- [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx)
- [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml)
- [`.github/workflows/copilot-setup-steps.yml`](../../.github/workflows/copilot-setup-steps.yml)
- [`docs/SECURITY-REVIEW.md`](../SECURITY-REVIEW.md)
- Git history query: `git log --since="90 days ago" --format= --name-only`
- Project-owner clarification: this repository deploys Expo web to GitHub Pages and is consumed as a submodule by a separate repository for Android/iOS builds.
