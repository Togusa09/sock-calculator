# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System | Type | Purpose | Auth model | Criticality | Evidence |
|---|---|---|---|---|---|
| React Native AsyncStorage | Device-local key/value storage | Working record and named saved items. | No application account; scoped to the installed app/platform storage. | High for persistence. | [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts), [`src/lib/library.ts`](../../src/lib/library.ts) |
| Expo Document Picker, File System, and Sharing | Platform file APIs | Select JSON input, read/write a file, and share exported data on native platforms. | User-initiated local file access/share. | Medium for import/export. | [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx), [`package.json`](../../package.json) |
| GitHub Actions and GitHub Pages | CI and static web hosting | Lint, test, export the Expo web target, and publish the `dist` artifact. | Workflow `contents: read`, `pages: write`, and `id-token: write` permissions. | High for this repository's web deployment; not used by runtime calculations. | [Pages workflow](../../.github/workflows/deploy-pages.yml) |
| `fetch(source.url)` in `src/lib/platform.ts` | Optional URL-based JSON helper | Fetch and parse a JSON URL if called. | URL supplied by caller; no auth handling in the helper. | `[TODO]` No source call sites were found, so runtime use is unconfirmed. | [`src/lib/platform.ts`](../../src/lib/platform.ts) |

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|---|---|---|---|---|
| AsyncStorage | Versioned active record and arrays of saved library items. | `useDataPersistence` and `src/lib/library.ts`. | App-local data is not a remote backup; parse and write failures have limited user-facing reporting. | [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts), [`src/lib/library.ts`](../../src/lib/library.ts) |

No application database or remote account store is declared in the manifest.

The Android/iOS build pipeline belongs to a separate repository that consumes this project as a submodule; it is outside this repository's deployment workflow.

### 3) Secrets and Credentials Handling

- The application dependencies do not declare an authentication provider or service credential SDK.
- `.env.development` and `.env.production` exist, but their contents were not read; no conclusion about their values or secret handling is made here.
- No `.env.example` or `.env.template` was found.
- `src/context/FeatureToggleContext.tsx` reads `NEXT_PUBLIC_FEATURES`; `[TODO]` confirm this configuration name and its intended behavior in the Expo toolchain.
- Credential rotation/lifecycle: `[TODO]` no application credential integration was identified.

### 4) Reliability and Failure Behavior

- No retry/backoff, request timeout, or circuit-breaker policy is configured for application integrations.
- Active-record restore removes the stored key after parse/validation failure; library parsing returns an empty list for malformed JSON.
- `src/lib/library.ts` does not await the AsyncStorage write promise in its internal `persist` helper.
- File import/export catches and logs errors; the user-facing `onError` callback is not invoked by `ImportExportData`.
- The Pages workflow fails on lint, test, privacy-page generation, or web-export step errors.

### 5) Observability for Integrations

- Application code uses `console.log`/`console.error` around import/export and logs the full imported record in the home route.
- No application metrics, tracing, or external monitoring dependency was found.
- The record logging conflicts with the repository's security instruction not to log measurement data.
- AsyncStorage failures and malformed saved data have no dedicated telemetry or consistent user-facing error path.

### 6) Evidence

- [`package.json`](../../package.json)
- [`app.json`](../../app.json)
- [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts)
- [`src/lib/library.ts`](../../src/lib/library.ts)
- [`src/lib/platform.ts`](../../src/lib/platform.ts)
- [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx)
- [`src/app/index.tsx`](../../src/app/index.tsx)
- [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml)
- [`.github/instructions/security.instructions.md`](../../.github/instructions/security.instructions.md)
