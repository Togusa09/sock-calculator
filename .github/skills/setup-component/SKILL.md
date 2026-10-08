---
name: setup-component
description: Create or extend a Sock Calculator UI component using its existing Next.js, React, and Tailwind patterns.
---

# Set Up a Component

Create a focused component or route UI that fits the existing Sock Calculator architecture.

Ask for the component's purpose, expected user behavior, and placement if they are not clear.

## Requirements

- Inspect nearby components, route composition, and any related tests before changing files.
- Place reusable UI in `src/components/` and route-specific UI under the matching `src/app/` route.
- Use explicit typed props, readable multiline JSX, and the established Tailwind CSS 4 styling.
- Keep interactive state and browser APIs within client components; preserve server-rendering and hydration behavior.
- Keep domain calculations and validation in `src/lib/` rather than embedding them in presentation.
- Add or update focused tests for changed behavior and run relevant lint, formatting, type, and test checks.
