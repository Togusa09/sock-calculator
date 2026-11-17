# Sock Calculator

Sock Calculator turns foot measurements and yarn tension into a starting stitch plan for a pair of socks. This repository's deployed target is the Expo web app on GitHub Pages. A separate repository consumes this project as a submodule and handles Android/iOS builds.

## Features

- Uses centimetres as the canonical unit, with metric and imperial input/display.
- Calculates a stitch plan from foot measurements, yarn tension, ease, and construction choices.
- Supports saved foot measurements, yarn profiles, tensions, construction choices, and named project records.
- Imports and exports versioned JSON records.
- Provides a compact screen and configuration screens for saved foot measurements and yarn profiles.

The calculator does not generate written knitting instructions, support variable-diameter shaping, or provide custom repeats. Formula assumptions are implemented in `src/lib/calculations.ts` and `src/lib/constructions.ts`.

## Development

Install dependencies and start the web app:

```bash
npm ci
npm run web
```

Other useful commands:

```bash
npm run lint
npm test -- --watchAll=false --ci
npx tsc --noEmit
npx expo export -p web
npm run build:privacy
```

The `test` script runs Jest in watch mode by default; the command above disables watch mode for a one-off run.

### Reusable wizard

`Wizard` and `WizardStep` in `src/components/Wizard.tsx` provide a linear, reusable flow. This component is not currently connected to the calculator screen.

```tsx
<Wizard
  canAdvance={(current, destination) => validateStep(current, destination)}
  onFinish={finish}
>
  <WizardStep
    id="measurements"
    label="Measurements"
    component={<Measurements />}
  />
  <WizardStep id="yarn" label="Yarn" component={<Yarn />} />
</Wizard>
```

Provide a nonempty, ordered set of steps with unique IDs that remain stable for the wizard's lifetime. Each `component` is a React element, so it can receive normal props. Step content stays mounted when hidden, preserving its local state; remounting the wizard resets it.

The optional synchronous `canAdvance(current, destination)` returns `false` to block forward navigation or Finish. `current` contains the step's `id`, `label`, and zero-based `index`; `destination` is either `{ type: "step", step }` with the same fields or `{ type: "finish" }`. Validation messages are the consumer's responsibility. Backward navigation is always allowed, and step labels can navigate directly only to previously visited steps. Pass `onFinish` to show a Finish button.

Native users can swipe horizontally or use Back/Next buttons; web uses buttons. Both provide a progress indicator. Styles are limited to layout and spacing, with suggestions for adding visual treatments.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` runs privacy-page generation, lint, tests, and an Expo web export for pull requests. On pushes to `master`, it publishes the exported `dist` directory to GitHub Pages. The workflow currently sets `PAGES_BASE_PATH=/`.

## Platform ownership

This repository contains the Expo Router source and web deployment workflow. Android/iOS build and release configuration is maintained by the separate repository that consumes this project as a submodule.
