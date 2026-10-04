# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: client-side Next.js App Router application with UI, hook, and domain-logic modules.
- Why this classification: the route and components compose the user experience, hooks coordinate browser storage after mount, and calculation/validation modules live separately under `src/lib/`.
- Primary constraints:
  - Calculations use centimetres as the canonical measurement unit.
  - Browser-only storage access stays in client-side paths and is deferred until after mount to preserve server/first-render agreement.
  - The production build is a static export intended for GitHub Pages; there is no application server or remote data service.

### 2) System Flow

```text
Next.js route -> React form/components -> CalculatorRecord -> calculations.ts -> constructions.ts -> ResultsPanel
                                     \-> persistence hook -> browser localStorage
```

1. `/` renders the client-side wizard in `src/app/page.tsx`.
2. `useDataPersistence` initializes with a default record, then restores the browser-stored record in an effect after mount.
3. Form components update the typed `CalculatorRecord`; import/export is coordinated by the route.
4. `calculateStitches` models foot measurements, applies ease/gauge/ribbing constraints, and delegates section formulas to construction definitions.
5. `ResultsPanel` presents the derived counts and explanatory details; changes to the record are persisted to local storage after hydration.
6. `/compact` loads reusable library items from local storage and combines a selected foot, yarn profile/tension, and construction into a record for the same calculation function.

### 3) Layer/Module Responsibilities

| Layer or module                      | Owns                                                                                                          | Must not own               | Evidence                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Routes (`src/app/`)                  | Page composition, route state, import/export controls                                                         | Core calculation formulas  | `src/app/page.tsx`, `src/app/compact/page.tsx`                                                              |
| Components (`src/components/`)       | Inputs, wizard interactions, saved-item UI, and result presentation                                           | Duplicated domain formulas | `src/components/FootMeasurements.tsx`, `src/components/Construction.tsx`, `src/components/ResultsPanel.tsx` |
| Hooks (`src/hooks/`)                 | Browser lifecycle and local-storage reads/writes                                                              | Calculation rules          | `src/hooks/UseDataPersistence.ts`, `src/hooks/UseLibraryItems.ts`                                           |
| Domain and calculations (`src/lib/`) | Types, unit conversions, record validation, derived measurements, fit, and construction selection             | React rendering            | `src/lib/domain.ts`, `src/lib/calculations.ts`, `src/lib/constructions.ts`                                  |
| Local library (`src/lib/library.ts`) | Versioned local-storage item operations for measurements, tensions, construction, projects, and yarn profiles | Remote persistence         | `src/lib/library.ts`                                                                                        |

### 4) Reused Patterns

| Pattern                               | Where found                                                                             | Why it exists                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Staged calculation pipeline           | `calculateFootSize`, `calculateFit`, `calculateStitches` in `src/lib/calculations.ts`   | Separates foot modeling, fit, and construction application                |
| Strategy/registry definitions         | `CUFF_DEFINITIONS`, `HEEL_DEFINITIONS`, `TOE_DEFINITIONS` in `src/lib/constructions.ts` | Selects the formula implementation by construction style                  |
| Generic local-library item operations | `LibraryItem<T>` and `listItems`/`saveItem`/`updateItem` in `src/lib/library.ts`        | Reuses CRUD behavior across saved item types                              |
| Shared save/load control              | `SavedItemsControl` in `src/components/SavedItemsControl.tsx`                           | Provides common named save/load behavior for projects and reusable inputs |

### 5) Known Architectural Risks

- The home route coordinates persistence-facing import/export, validation feedback, wizard state, and several panels; changes to that page should preserve the client/server boundary and be tested at the route level (`src/app/page.tsx`).
- The calculated flow depends on persisted/imported records meeting domain-shape expectations; boundary validation limitations are tracked in `CONCERNS.md` (`src/lib/validation.ts`, `src/hooks/UseDataPersistence.ts`).

### 6) Evidence

- `src/app/page.tsx`
- `src/app/compact/page.tsx`
- `src/hooks/UseDataPersistence.ts`
- `src/lib/calculations.ts`
- `src/lib/constructions.ts`
- `src/lib/library.ts`
- `src/components/ResultsPanel.tsx`
