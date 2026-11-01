# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: Expo Router application with route, shared UI, hook, and domain-logic modules; it targets native and web through Expo configuration.
- Why this classification: `package.json` selects Expo Router as the entry point, `app.json` configures a web target, and `src/app/` composes UI backed by reusable components, hooks, and `src/lib/` calculations.
- Primary constraints:
  - Measurements are represented in canonical centimetres; display-unit conversion is handled separately.
  - App data is stored locally through AsyncStorage; no server or remote account layer is declared.
  - This repository deploys the Expo web target to GitHub Pages. A separate submodule consumer handles Android/iOS builds; platform-specific file handling in this source should remain compatible with that consumer.

### 2) System Flow

```text
Expo Router entry -> route screen -> shared inputs/components -> CalculatorRecord
                                       |                         |
                                       |                         v
                                       +-> AsyncStorage      calculations -> ResultsPanel
                                       +-> JSON file import/export
```

1. `expo-router/entry` loads `src/app/_layout.tsx`, which registers the root stack and route screens.
2. The home screen calls `useDataPersistence`, receives the working record, and renders measurement, yarn, tension, and construction inputs.
3. `useDataPersistence` restores and saves the record through AsyncStorage; saved named items use the operations in `src/lib/library.ts`.
4. The home screen calls `calculateStitches`; the calculation module derives optional measurements, applies fit/ease, then dispatches construction calculations.
5. `ResultsPanel` formats canonical centimetres into the selected display unit and presents the resulting stitch plan.
6. `/compact` selects saved measurements, yarn, tension, and construction, composes a record, and calls the same calculation pipeline.

### 3) Layer/Module Responsibilities

| Layer or module | Owns | Must not own | Evidence |
|---|---|---|---|
| Routes (`src/app/`) | Navigation and screen-level composition/state. | Reimplementing calculation formulas. | [`src/app/index.tsx`](../../src/app/index.tsx), [`src/app/compact/index.tsx`](../../src/app/compact/index.tsx) |
| Components (`src/components/`) | Inputs, saved-item interactions, import/export controls, and result display. | Canonical calculation rules. | [`src/components/ImportExportData.tsx`](../../src/components/ImportExportData.tsx), [`src/components/ResultsPanel.tsx`](../../src/components/ResultsPanel.tsx) |
| Hooks (`src/hooks/`) | AsyncStorage-backed state and library reads. | Owning stitch formulas. | [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts), [`src/hooks/UseLibraryItems.ts`](../../src/hooks/UseLibraryItems.ts) |
| Domain/calculation modules (`src/lib/`) | Typed records, validation, conversions, calculation stages, and saved-library operations. | React screen composition. | [`src/lib/domain.ts`](../../src/lib/domain.ts), [`src/lib/calculations.ts`](../../src/lib/calculations.ts) |

### 4) Reused Patterns

| Pattern | Where found | Why it exists |
|---|---|---|
| Staged calculation pipeline | `calculateFootSize`, `calculateFit`, and `calculateStitches` in `src/lib/calculations.ts`. | Separates derived measurements, fit, and construction output. |
| Construction definition registries | `CUFF_DEFINITIONS`, `HEEL_DEFINITIONS`, and `TOE_DEFINITIONS` in `src/lib/constructions.ts`. | Selects the formula for a chosen construction style. |
| Generic saved-item operations | `LibraryItem<T>` and the `listItems`/`saveItem`/`updateItem` family in `src/lib/library.ts`. | Shares storage behavior across saved item categories. |
| Platform-specific UI files | `.web.tsx` and `.tsx` component pairs under `src/components/`. | Allows web-specific UI where a shared native component is not used. |

### 5) Known Architectural Risks

- Imported records are cast to `CalculatorRecord` after only a shallow object/version check; deeper validation gaps are detailed in [`CONCERNS.md`](./CONCERNS.md).
- Persistence and file-import errors do not consistently reach visible UI feedback; see `src/hooks/UseDataPersistence.ts` and `src/components/ImportExportData.tsx`.
- Platform-specific import/export handling lives inside a UI component while a separate helper exists in `src/lib/platform.ts`; the helper has no source call sites in the current tree.

### 6) Evidence

- [`package.json`](../../package.json)
- [`app.json`](../../app.json)
- [`src/app/_layout.tsx`](../../src/app/_layout.tsx)
- [`src/app/index.tsx`](../../src/app/index.tsx)
- [`src/app/compact/index.tsx`](../../src/app/compact/index.tsx)
- [`src/hooks/UseDataPersistence.ts`](../../src/hooks/UseDataPersistence.ts)
- [`src/lib/calculations.ts`](../../src/lib/calculations.ts)
- [`src/lib/constructions.ts`](../../src/lib/constructions.ts)
- [`src/lib/library.ts`](../../src/lib/library.ts)
