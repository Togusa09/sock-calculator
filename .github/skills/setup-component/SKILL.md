---
name: setup-component
description: Create or extend a Sock Calculator screen or component using Expo Router and React Native patterns.
---

# Set Up a Component

Create a focused React Native component or Expo Router screen that fits the existing Sock Calculator architecture.

Ask for the component's purpose, expected user behavior, and placement if they are not clear.

## Requirements

- Inspect nearby components, route composition, and any related tests before changing files.
- Place reusable UI in `src/components/` and route screens under the matching `src/app/` Expo Router path.
- Use explicit typed props, accessible React Native controls, and the established mobile-first UI patterns.
- Keep platform-specific differences isolated using repository conventions, and preserve behavior on Expo web and native platforms.
- Keep domain calculations and validation in `src/lib/` rather than embedding them in presentation.
- Check matching versioned Expo documentation before changing Expo or React Native APIs.
- Add or update focused Jest tests and run relevant lint, type, and test checks.
