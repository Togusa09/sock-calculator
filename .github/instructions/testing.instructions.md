---
applyTo: "src/**/*.{test,spec}.{ts,tsx}"
description: "Jest and React Native Testing Library standards for Sock Calculator"
---

# Testing Standards

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Use Jest with the existing `jest-expo` setup and React Native Testing Library; name tests `*.test.ts` or `*.test.tsx` and follow established placement.
- Cover calculations, unit conversions, validation, AsyncStorage persistence, and import/export with deterministic cases for normal, invalid, and boundary inputs.
- Test observable behavior and accessible controls rather than implementation details. Mock native and Expo modules using repository patterns, and isolate AsyncStorage and other mutable state between tests.
- Keep tests independent of network services, platform-specific execution order, and uninstalled test environments.
- Run `npm test -- --watchAll=false --ci`, `npm run lint`, and `npx tsc --noEmit` as appropriate. The plain `npm test` command runs in watch mode.
