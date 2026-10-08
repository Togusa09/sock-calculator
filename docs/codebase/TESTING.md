# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: Vitest `^4.1.11`.
- Assertion/mocking tools: Vitest `expect` and `vi`; jsdom `^29.1.1`; React DOM for component rendering.
- Commands:

```bash
npm test
npx vitest run src/lib/calculations.test.ts
npx tsc --noEmit
npm run format:check
npm run lint
```

There is no configured coverage command.

### 2) Test Layout

- Test files are colocated with source and use `.test.ts` / `.test.tsx`.
- Current suites cover `src/lib/` calculations, unit conversion, validation, compact summaries, and local library operations; component/route coverage includes wizard tabs, configuration pages, and `/compact`.
- `vitest.config.ts` selects jsdom globally and loads `vitest.setup.ts`.
- DOM-oriented tests may also declare `// @vitest-environment jsdom`.

### 3) Test Scope Matrix

| Scope                 | Covered?                  | Typical target                                                              | Notes                                                   |
| --------------------- | ------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| Unit                  | Yes                       | Calculation, conversions, validation, library helpers, compact descriptions | Pure domain tests use Vitest                            |
| Integration/component | Yes, focused              | Configuration pages, wizard tabs, compact route                             | Rendered with React DOM and jsdom                       |
| E2E                   | No configured suite found | Full browser/user journey                                                   | `[TODO]` Add only if browser-level behavior requires it |

### 4) Mocking and Isolation Strategy

- Main mocking approach: custom `window.localStorage` mock in `vitest.setup.ts`; `next/link` is mocked in page/component tests where needed.
- Isolation: tests clear local storage and DOM state in `beforeEach` for suites using them.
- External network services are not part of the application and are not mocked.
- Common limitation: no browser automation layer is configured, so tests do not exercise a real browser or deployed static export.

### 5) Coverage and Quality Signals

- Coverage tool + threshold: `[TODO]` No coverage provider, command, or threshold is configured.
- Current reported coverage: `[TODO]` No coverage report was found.
- Known gaps: no E2E/browser suite; malformed nested import and persisted-record shapes should receive explicit boundary tests alongside stronger validation.
- GitHub Actions runs formatting, ESLint, Vitest, and the static production build for pull requests (`.github/workflows/deploy-pages.yml`).

### 6) Evidence

- `package.json`
- `vitest.config.ts`
- `vitest.setup.ts`
- `src/lib/calculations.test.ts`
- `src/lib/validation.test.ts`
- `src/lib/library.test.ts`
- `src/app/compact/page.test.tsx`
- `.github/workflows/deploy-pages.yml`
