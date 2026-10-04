---
applyTo: "src/**/*.{ts,tsx,js,jsx,json}"
description: "Security and privacy standards for Sock Calculator"
---

# Security and Privacy

Apply the repository-wide guidance in [Copilot instructions](../copilot-instructions.md).

- Treat imported JSON and browser-stored values as untrusted input; validate shape, version, and domain constraints before using them.
- Keep personal measurement data in the existing browser-local storage model unless a requested feature explicitly changes that design.
- Never commit credentials, private user data, or machine-specific secrets. Do not log measurement records or other user data.
- Avoid unsafe HTML injection and dynamic code execution. Render user-provided text as text and use established validation and error messaging.
- Keep dependencies and workflow permissions minimal; do not introduce external services or transmit user data without an explicit product requirement.
