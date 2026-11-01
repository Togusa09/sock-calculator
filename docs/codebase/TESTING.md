# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: Jest `~30.5.2` with `jest-expo` `~58.0.13`.
- Assertion/mocking tools: Jest `expect`/`jest` APIs and `@testing-library/react-native` `^14.1.0`.
- Commands:

```bash
npm test -- --watchAll=false --ci
npx jest --runInBand
npm run lint
npx tsc --noEmit
```

The `test` script runs `jest --watchAll`; CI appends `--watchAll=false --ci`. No coverage command is configured.

### 2) Test Layout

- Test files use `.test.ts` and `.test.tsx`, colocated with modules/components where practical.
- Domain suites cover calculations, validation, unit conversion, compact details, and library operations under `src/lib/`.
- UI tests cover feature toggles, wizard tabs, configuration pages, and the compact screen.
- `jest.config.ts` uses the `jest-expo` preset and sets transform exclusions for React Native and Expo packages.
- `src/__mocks__/@react-native-async-storage/async-storage.js` forwards to AsyncStorage's Jest mock; relevant tests clear the mock store.

### 3) Test Scope Matrix

| Scope | Covered? | Typical target | Notes |
|---|---|---|---|
| Unit | Yes | Calculations, validation, units, library helpers, compact descriptions. | Jest tests under `src/lib/`. |
| Component/screen | Yes, focused | Wizard tabs, configuration, compact results, feature toggles. | Uses React Native Testing Library. |
| Integration with real services | No service-backed integration suite found. | AsyncStorage module is mocked. | No remote service or database is configured. |
| E2E/device | No configured suite found. | `[TODO]` Add only if native or real-browser flows need automated coverage. | The Pages workflow exports web but does not run browser automation. |

### 4) Mocking and Isolation Strategy

- AsyncStorage uses the package-provided Jest mock forwarded through `src/__mocks__/`.
- Relevant library and compact-screen tests clear AsyncStorage before each case.
- Tests use local data and do not require external service credentials.
- Some UI tests contain commented-out assertions or interaction cases; those comments do not execute as coverage.

### 5) Coverage and Quality Signals

- Coverage tool + threshold: `[TODO]` No coverage provider, command, or threshold is configured.
- Current reported coverage: `[TODO]` No coverage report was found.
- Known gaps: no configured E2E/native-device run; malformed nested import shapes and persistence write failures do not have focused boundary tests.
- CI runs privacy-page generation, Expo lint, Jest, and `npx expo export -p web`; it does not explicitly run `tsc --noEmit`.
- Some repository instruction files still prescribe Vitest and `npm run format:check`; the checked-in manifest/configure Jest and no such script. See the `Intent vs. Reality` section in [`CONCERNS.md`](./CONCERNS.md).

### 6) Evidence

- [`package.json`](../../package.json)
- [`jest.config.ts`](../../jest.config.ts)
- [`src/__mocks__/@react-native-async-storage/async-storage.js`](../../src/__mocks__/@react-native-async-storage/async-storage.js)
- [`src/lib/calculations.test.ts`](../../src/lib/calculations.test.ts)
- [`src/lib/validation.test.ts`](../../src/lib/validation.test.ts)
- [`src/lib/library.test.ts`](../../src/lib/library.test.ts)
- [`src/components/config/ConfigPages.test.tsx`](../../src/components/config/ConfigPages.test.tsx)
- [`src/app/compact/__tests__/page.test.tsx`](../../src/app/compact/__tests__/page.test.tsx)
- [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml)
