# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System                         | Type (API/DB/Queue/etc) | Purpose                                                            | Auth model                                       | Criticality                                 | Evidence                                                |
| ------------------------------ | ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------- |
| Browser `localStorage`         | Browser storage API     | Store active calculator record and reusable library items locally  | Browser origin/profile; no application login     | High to user data persistence               | `src/hooks/UseDataPersistence.ts`, `src/lib/library.ts` |
| GitHub Actions / GitHub Pages  | CI and static hosting   | Check pull requests, build static export, and deploy from `master` | GitHub workflow permissions and Actions identity | High to deployment, not runtime calculation | `.github/workflows/deploy-pages.yml`                    |
| File APIs (`Blob`, file input) | Browser APIs            | Export and import a JSON calculator record                         | User-initiated local file selection/download     | Low                                         | `src/app/page.tsx`                                      |

No external application API, database, queue, authentication provider, or telemetry service was found in the declared dependencies or source search.

### 2) Data Stores

| Store                 | Role                                                                          | Access layer                                  | Key risk                                                                      | Evidence                                                |
| --------------------- | ----------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------- |
| Browser local storage | Active record plus typed library arrays stored under `sock-calculator-*` keys | `useDataPersistence` and `src/lib/library.ts` | Origin-local data is not a backup; malformed values can be dropped or removed | `src/hooks/UseDataPersistence.ts`, `src/lib/library.ts` |

### 3) Secrets and Credentials Handling

- Credential sources: none identified; no `.env.example`, `.env.template`, or application secrets were found.
- `PAGES_BASE_PATH` is a non-secret build configuration value set by the Pages workflow.
- No external API credentials are needed by the application.
- Rotation/lifecycle notes: not applicable to the current application integrations.

### 4) Reliability and Failure Behavior

- Retry/backoff: no external application calls exist, so no retry policy is configured.
- Timeout policy: no external application request timeout was found.
- Circuit breaker/fallback: not applicable.
- Persistence recovery: the active-record hook removes stored data when record parsing/validation throws; library-list parsing returns an empty list when stored JSON cannot be parsed or is not an array (`src/hooks/UseDataPersistence.ts`, `src/lib/library.ts`).
- GitHub Actions fails the build workflow on failing format, lint, test, or build steps (`.github/workflows/deploy-pages.yml`).

### 5) Observability for Integrations

- Application logging around browser storage/file actions: no logging calls were found in `src/`.
- Metrics/tracing: no application metrics or tracing integration was found.
- Visibility gap: local persistence failures are not reported through a dedicated user-facing recovery flow.

### 6) Evidence

- `src/hooks/UseDataPersistence.ts`
- `src/lib/library.ts`
- `src/app/page.tsx`
- `.github/workflows/deploy-pages.yml`
- `next.config.ts`
- `package.json`
