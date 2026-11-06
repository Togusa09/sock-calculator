---
name: write-tests
description: Add focused Jest and React Native Testing Library coverage for Sock Calculator behavior.
---

# Write Tests

Add or improve tests that verify the requested behavior using the repository's Jest, jest-expo, and React Native Testing Library conventions.

Ask which behavior or regression needs coverage if the request does not make it clear.

## Requirements

- Read the implementation and neighboring tests first; preserve the current test organization and naming.
- Use Jest for domain logic and React Native Testing Library for UI behavior; follow existing mocks for Expo and native modules.
- Cover normal behavior, meaningful boundaries, invalid data, and regression cases relevant to the change.
- Assert observable results and accessible behavior rather than private implementation details.
- Isolate AsyncStorage, mocks, and other mutable state between tests.
- Do not add a test dependency unless the task requires it and the user approves the dependency change.
- Run the targeted tests, then the repository's relevant lint and TypeScript checks. Use `npm test -- --watchAll=false --ci` for a non-watch run.
