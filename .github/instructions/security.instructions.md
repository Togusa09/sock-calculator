---
applyTo: "src/**/*.{ts,tsx,js,jsx,json}"
description: "Security and privacy standards for Sock Calculator"
---

# Security and Privacy

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Treat imported JSON and AsyncStorage values as untrusted input; validate shape, schema version, and domain constraints before using them.
- Keep personal measurement data in the existing on-device AsyncStorage model unless a requested feature explicitly changes that design.
- Never commit credentials, private user data, or machine-specific secrets. Do not log measurement records or other user data.
- Render user-provided text safely, avoid dynamic code execution, and use established validation and error messaging across web and native platforms.
- Keep dependencies and workflow permissions minimal; do not introduce external services or transmit user data without an explicit product requirement.
