# Sock Calculator — Copilot Instructions

## Project Overview

Sock Calculator is an Expo and React Native app that turns foot measurements and yarn tension into a starting stitch plan. It uses centimetres as its canonical measurement, supports metric and imperial input and display, and persists user data with AsyncStorage. The primary release target for this repository is Expo web on GitHub Pages; a separate repository consumes it as a submodule for Android and iOS builds.

## Tech Stack

- TypeScript 6, React 19, React Native 0.88, and Expo SDK 58
- Expo Router 58 and AsyncStorage
- Jest 30 with jest-expo and React Native Testing Library 14
- ESLint 9 and Prettier 3
- Expo web export deployed to GitHub Pages; Node.js 24 and npm in GitHub Actions

## Conventions

- **Naming:** Use PascalCase for React components and types, camelCase for functions and variables, and follow existing filenames and route naming in `src/`.
- **Structure:** Expo Router routes live in `src/app/`; reusable UI in `src/components/`; domain logic and validation in `src/lib/`; persistence hooks in `src/hooks/`. Keep calculations independent of presentation where practical.
- **Rendering and navigation:** Use Expo Router for navigation and preserve React Native behavior across web, Android, and iOS. Keep platform-specific behavior isolated using existing platform-file patterns, and design mobile-first with accessible controls.
- **Data and errors:** Keep centimetres canonical and preserve the existing versioned JSON import/export format. Treat imported and AsyncStorage data as untrusted, validate it at boundaries, and use established user-facing error patterns rather than hiding failures.
- **Scope:** This is a client-side calculator, not a server-backed account system. Keep personal measurement data on-device and do not add server services or expand product behavior without an explicit requirement.
- **UI:** Prefer small, focused components, explicit typed props, and readable JSX. Follow nearby React Native and Expo UI patterns rather than introducing web-only styling or dependencies.
- **Expo APIs:** Before changing Expo, Expo Router, EAS, or React Native APIs, check the installed Expo major version and read its matching versioned documentation. Use `npx expo install` for Expo-compatible dependencies.

## Workflow

- Use short, descriptive branches and commits; no stricter branch or commit naming scheme is established in this repository.
- Pull requests should explain the user-visible change and list the validation run.
- Run `npx expo lint` (or `npm run lint`, which invokes Expo lint), `npx tsc --noEmit`, and `npm test -- --watchAll=false --ci` as appropriate. For web-export changes, also run `npx expo export -p web`; `npm test` without flags starts Jest in watch mode.
- Use Node.js 24 and npm, matching the GitHub Actions workflows.
- Apply the detailed guidance in:
  - [TypeScript and Expo guidelines](instructions/typescript.instructions.md)
  - [Testing guidelines](instructions/testing.instructions.md)
  - [Security guidelines](instructions/security.instructions.md)
  - [Documentation guidelines](instructions/documentation.instructions.md)
  - [Performance guidelines](instructions/performance.instructions.md)
  - [Code review guidelines](instructions/code-review.instructions.md)
