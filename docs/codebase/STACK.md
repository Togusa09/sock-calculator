# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area | Value | Evidence |
|---|---|---|
| Primary language | TypeScript; `tsconfig.json` enables strict mode and extends Expo's base config. | [`package.json`](../../package.json), [`tsconfig.json`](../../tsconfig.json) |
| Runtime + version | Expo SDK `~58.0.21`, React `19.3.0`, React Native `0.88.0`; no Node version is pinned in the package manifest. | [`package.json`](../../package.json) |
| Package manager | npm; the repository contains `package-lock.json` (lockfile version 3). | [`package-lock.json`](../../package-lock.json) |
| Module/build system | Expo Router entry (`expo-router/entry`), file-based routes, and Expo web export for this repository's GitHub Pages deployment. A separate consuming repository handles Android/iOS builds. | [`package.json`](../../package.json), [`app.json`](../../app.json), [Pages workflow](../../.github/workflows/deploy-pages.yml), project-owner clarification |

### 2) Production Frameworks and Dependencies

High-impact app dependencies declared in `package.json`:

| Dependency | Version | Role |
|---|---:|---|
| `expo` | `~58.0.21` | Cross-platform app runtime and tooling. |
| `expo-router` | `~58.0.28` | File-based navigation and app entry. |
| `react` / `react-native` | `19.3.0` / `0.88.0` | UI runtime and native components. |
| `react-native-web` | `^0.21.4` | React Native components on the web target. |
| `@expo/ui` | `~58.0.25` | Expo UI primitives used by app screens. |
| `@react-native-async-storage/async-storage` | `2.2.0` | Device-local persistence for the working record and saved library. |
| `expo-document-picker` | `~58.0.4` | Select JSON files for import. |
| `expo-file-system` | `~58.0.11` | Read picked files and write exports. |
| `expo-sharing` | `~58.0.21` | Share exported files on native platforms. |

The manifest does not declare a server framework, application database, authentication provider, or remote API client. `src/lib/platform.ts` contains a URL-fetch helper, but no current source call site was found for that helper.

### 3) Development Toolchain

| Tool | Purpose | Evidence |
|---|---|---|
| TypeScript `~6.0.3` | Static checking; strict mode is enabled. | [`package.json`](../../package.json), [`tsconfig.json`](../../tsconfig.json) |
| ESLint `^9.39.5`, `eslint-config-expo` `~58.0.4` | Linting through Expo's flat config. | [`package.json`](../../package.json), [`eslint.config.js`](../../eslint.config.js) |
| Jest `~30.5.2`, `jest-expo` `~58.0.13` | Test runner and Expo test preset. | [`package.json`](../../package.json), [`jest.config.ts`](../../jest.config.ts) |
| `@testing-library/react-native` `^14.1.0` | Component tests. | [`package.json`](../../package.json), [`src/components/config/ConfigPages.test.tsx`](../../src/components/config/ConfigPages.test.tsx) |
| Prettier `^3.9.10` | Declared formatter dependency; no format script is defined in `package.json`. | [`package.json`](../../package.json) |

### 4) Key Commands

```bash
npm ci
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm test -- --watchAll=false --ci
npx expo export -p web
npm run build:privacy
```

`npm test` runs Jest in watch mode by default; CI disables watch mode with the extra flags above. There are no package scripts named `dev`, `build`, `format:check`, or `typecheck`. TypeScript can be invoked directly with `npx tsc --noEmit`.

### 5) Environment and Config

- Main configuration: [`app.json`](../../app.json), [`tsconfig.json`](../../tsconfig.json), [`jest.config.ts`](../../jest.config.ts), and [`eslint.config.js`](../../eslint.config.js).
- `.env.development` and `.env.production` are present. Their contents were not read; `[TODO]` document their non-secret variable names and intended use.
- `src/context/FeatureToggleContext.tsx` reads `process.env.EXPO_PUBLIC_FEATURES`; `[TODO]` verify whether this variable is intentionally supported by the current Expo build.
- This repository's deployed target is Expo web on GitHub Pages. The web export uses `output: "single"` in `app.json`; the Pages workflow runs on Node 24 and exports web assets to `dist`.
- A separate repository consumes this project as a submodule and handles Android/iOS builds. No `eas.json`, `.nvmrc`, or package `engines` field was found here; the local `android/` directory is ignored by Git, and there is no `ios/` directory.

### 6) Evidence

- [`package.json`](../../package.json)
- [`package-lock.json`](../../package-lock.json)
- [`app.json`](../../app.json)
- [`tsconfig.json`](../../tsconfig.json)
- [`jest.config.ts`](../../jest.config.ts)
- [`eslint.config.js`](../../eslint.config.js)
- [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml)
- [`src/context/FeatureToggleContext.tsx`](../../src/context/FeatureToggleContext.tsx)
