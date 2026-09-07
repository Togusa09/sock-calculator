<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project guidance

- Split complex sections into focused subcomponents or modules to avoid excessive complexity in a single file. Keep each extracted unit responsible for one clear concern and pass state through explicit, typed props or interfaces.
- Format JSX and HTML as readable multiline markup. Do not put an entire component return or large nested element tree on a single line; use indentation and line breaks so structure, props, and conditional content are easy to review.
- Run `npm run format:check` with lint and tests; use `npm run format` to apply the repository formatter.
