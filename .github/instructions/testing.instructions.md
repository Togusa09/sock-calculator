---
applyTo: "src/**/*.{test,spec}.{ts,tsx}"
description: "Testing standards for Sock Calculator"
---

# Testing Standards

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Use Vitest and the existing test organization; name tests `*.test.ts` or `*.test.tsx` and colocate them with the related source where practical.
- Cover calculation, conversion, validation, persistence, and import/export behavior with deterministic tests, including relevant invalid and boundary inputs.
- Use jsdom only for tests that need browser APIs or DOM behavior. Keep pure domain tests independent of the browser.
- Test observable user behavior and accessible controls rather than implementation details. Use the testing dependencies already installed; do not assume an uninstalled UI testing library.
- Keep tests isolated: reset browser storage and mocks between cases, and avoid depending on execution order or external services.
- Run `npm test` after test or behavior changes; run `npm run lint`, `npm run format:check`, and `npx tsc --noEmit` as appropriate.
