---
name: write-tests
description: Add focused Vitest coverage for Sock Calculator calculations, validation, persistence, and UI behavior.
---

# Write Tests

Add or improve tests that verify the requested behavior using the repository's Vitest conventions.

Ask which behavior or regression needs coverage if the request does not make it clear.

## Requirements

- Read the implementation and neighboring tests first; preserve the current test organization and naming.
- Use pure Vitest tests for domain logic and jsdom only when DOM or browser APIs are needed.
- Cover normal behavior, meaningful boundaries, invalid data, and regression cases relevant to the change.
- Assert observable results and behavior rather than private implementation details.
- Isolate local storage, mocks, and other mutable state between tests.
- Do not add a test dependency unless the task requires it and the user approves the dependency change.
- Run the targeted tests, then the repository's relevant lint, formatting, and TypeScript checks.
