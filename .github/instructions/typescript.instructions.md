---
applyTo: "src/**/*.{ts,tsx}"
description: "TypeScript, React Native, and Expo standards for Sock Calculator"
---

# TypeScript, React Native, and Expo

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Preserve TypeScript strictness, model domain concepts explicitly, and avoid `any` or unchecked assertions.
- Follow Expo Router conventions in `src/app/`; use `expo-router` for navigation and keep reusable UI, domain logic, and persistence in their established `src/` areas.
- Build mobile-first with React Native and Expo components, explicit typed props, accessible controls, and existing platform-specific file patterns.
- Keep calculation and validation logic separate from presentation. Preserve canonical centimetres and validate data at import, AsyncStorage, and UI boundaries.
- Before using or changing Expo, Expo Router, or React Native APIs, check the installed Expo major version and read the matching versioned Expo documentation. Do not rely on remembered APIs across SDK versions.
- Add dependencies with `npx expo install` when they include Expo or native functionality, and keep web and native behavior compatible.
- Use readable JSX and follow the repository's existing formatting and file-naming conventions.
