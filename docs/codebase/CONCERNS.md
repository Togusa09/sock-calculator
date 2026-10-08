# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern                                                                                                                                        | Evidence                                                    | Impact                                                                                                                                            | Suggested action                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Medium   | Imported/persisted record validation checks selected values but does not validate the full nested object shape before dereferencing or casting | `src/lib/validation.ts`, `src/hooks/UseDataPersistence.ts`  | Malformed nested JSON can result in generic runtime errors on import; invalid active data is removed on restore without a user-facing explanation | Validate unknown input shape at the boundary and add malformed nested-shape tests |
| Low      | Saved library envelopes are only shallowly checked before casting item data to the requested generic type                                      | `src/lib/library.ts`                                        | Malformed but parseable stored items can reach screens as if they had the expected domain type                                                    | Validate item metadata and each item's `data` shape when reading                  |
| Low      | The README previously said separate saved projects were not supported, while named project save/load and `/compact` already existed            | `README.md`, `src/app/page.tsx`, `src/app/compact/page.tsx` | Product documentation could mislead users about available workflows                                                                               | Resolved in this task: README now describes current behavior                      |

### 2) Technical Debt

| Debt item                                                                                                                       | Why it exists                                                                                                        | Where                                                                    | Risk if ignored                                                     | Suggested fix                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Several design-document capabilities remain aspirational, including a sock-pattern entity and advanced swatch/tension workflows | The design document includes both MVP and future/planned descriptions; current domain types do not model all of them | `docs/design.md`, `src/lib/domain.ts`, `src/components/YarnTension.tsx`  | Readers may mistake design intent for implemented behavior          | Keep roadmap sections clearly labeled and validate them against source during product updates |
| Boundary validation does not fully narrow unknown JSON into domain types                                                        | Parsing checks are followed by a type assertion and typed nested access                                              | `src/lib/validation.ts`                                                  | Malformed input can fail with incidental exceptions or be discarded | Add explicit structural validators and boundary-focused tests                                 |
| No coverage reporting or browser-level end-to-end checks are configured                                                         | Current test setup is Vitest/jsdom                                                                                   | `package.json`, `vitest.config.ts`, `.github/workflows/deploy-pages.yml` | Build/deployment or real-browser issues may escape component tests  | `[TODO]` Decide whether coverage/E2E is warranted for project needs                           |

### 3) Security Concerns

| Risk                                                                                                                | OWASP category (if applicable) | Evidence                                                | Current mitigation                                                                                                                      | Gap                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Measurement/project data is stored in browser local storage and is accessible to scripts running in the same origin | N/A                            | `src/hooks/UseDataPersistence.ts`, `src/lib/library.ts` | No backend transmission is present; security guidance prohibits logging measurement data and calls for validation at boundaries         | Local storage is not encrypted or suitable for secrets; imported/persisted shape validation should be strengthened |
| GitHub Actions has write permissions needed for Pages deployment                                                    | N/A                            | `.github/workflows/deploy-pages.yml`                    | Workflow declares `contents: read`, `pages: write`, and `id-token: write`; deployment is limited to the workflow's configured event/ref | Review permissions if deployment triggers or publishing steps change                                               |

No committed secret configuration or application authentication surface was identified. The scan found no security-specific config files; that does not constitute a security audit.

### 4) Performance and Scaling Concerns

| Concern                                                                 | Evidence                                                                            | Current symptom                                     | Scaling risk                                                                   | Suggested improvement                                                                      |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| No benchmark, profiling, or load-test configuration was found           | `package.json`; `.github/workflows/deploy-pages.yml`; repository configuration scan | `[TODO]` No measured performance baseline available | `[TODO]` Expected data volume/device constraints are not documented            | Measure before optimizing; add targeted profiling only if a requirement or symptom appears |
| Saved library lists are read from local storage as complete JSON arrays | `src/lib/library.ts`, `src/hooks/UseLibraryItems.ts`                                | Not established as a current user-visible problem   | Very large user-created libraries would require full parse/filter work on read | Keep behavior simple unless real library sizes show a measurable issue                     |

### 5) Fragile/High-Churn Areas

| Area                                                     | Why fragile                                                 | Churn signal                                                                                  | Safe change strategy                                                                         |
| -------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/app/page.tsx`                                       | Coordinates wizard state, record updates, and import/export | 4 file changes in the scan's last-90-day history                                              | Preserve client hydration/persistence behavior; use focused route tests                      |
| `src/lib/calculations.ts` and `src/lib/constructions.ts` | Formulas directly determine user-facing stitch counts       | 4 changes each in the scan's recent history (construction paths include older path spellings) | Add/adjust deterministic calculation tests for each formula and boundary                     |
| `src/lib/library.ts` and `src/lib/validation.ts`         | Local persistence and untrusted data boundaries             | 3 changes each in the scan's recent history                                                   | Validate stored/imported values, cover malformed cases, and keep localStorage tests isolated |
| `src/components/SavedItemsControl.tsx`                   | Shared named save/load UX for several data types            | 4 changes in the scan's recent history                                                        | Test dirty-state, save/load, delete, and start-new flows when changing behavior              |
| `src/app/globals.css`                                    | Shared responsive presentation across routes                | 5 current-path changes in the scan's recent history                                           | Check desktop and narrow layouts after shared styling changes                                |

Churn figures are from the repository scan's Git history window; they are signals for review, not proof of defects.

### 6) `[ASK USER]` Questions

1. Resolved `[ASK USER]`: Should the README remain aligned with its initial MVP statement or describe current named project save/load and compact workflows? The user requested updating it to match current behavior; `README.md` was updated accordingly.

No unresolved intent questions remain from this documentation pass.

### 7) Evidence

- `git log --since="90 days ago" --name-only` (terminal evidence used to identify recent file churn)
- `README.md`
- `docs/design.md`
- `src/lib/validation.ts`
- `src/lib/library.ts`
- `src/hooks/UseDataPersistence.ts`
- `src/app/page.tsx`
- `src/app/compact/page.tsx`
- `src/components/SavedItemsControl.tsx`
- `.github/workflows/deploy-pages.yml`
