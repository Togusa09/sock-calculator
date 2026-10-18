import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const markdownPath = path.join(rootDir, "content", "PrivacyPolicy.md");
const outputPath = path.join(rootDir, "public", "PrivacyPolicy.html");

export function generatePrivacyHtml(markdownSource) {
  const content = markdownSource ?? fs.readFileSync(markdownPath, "utf-8");

  // Extract title and last updated if present at the start of the markdown
  const lines = content.split("\n");
  let title = "Privacy Policy";
  let lastUpdated = "";
  let bodyLines = [];
  let index = 0;

  for (; index < lines.length; index++) {
    const line = lines[index].trim();
    if (line.startsWith("# ")) {
      title = line.replace(/^#\s+/, "").trim();
    } else if (line.toLowerCase().startsWith("last updated:")) {
      lastUpdated = line;
      index++;
      break;
    } else if (line.length > 0) {
      break;
    }
  }

  bodyLines = lines.slice(index);
  const bodyMarkdown = bodyLines.join("\n");
  const parsedBody = marked.parse(bodyMarkdown);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <title>${title} - Sock Calculator</title>
    <meta
      name="description"
      content="Privacy Policy for Sock Calculator Web and Mobile Applications."
    />
    <link rel="icon" href="favicon.ico" sizes="any" />
    <style>
      :root {
        --ink: #24231f;
        --muted: #77746b;
        --paper: #f4f1ea;
        --panel: #fffdf8;
        --line: #ddd8ca;
        --orange: #c75b36;
        --sage: #61766b;
        --serif: Georgia, "Times New Roman", serif;
        --font-geist-sans: Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        --font-geist-mono: "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      }
      * {
        box-sizing: border-box;
      }
      html {
        -webkit-overflow-scrolling: touch;
        background: var(--paper);
        color: var(--ink);
        font-family: var(--font-geist-sans), sans-serif;
      }
      body {
        margin: 0;
        padding: 0;
        background: var(--paper);
        color: var(--ink);
        font-family: var(--font-geist-sans), sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .app-shell {
        max-width: 920px;
        width: 100%;
        margin: 0 auto;
        padding: env(safe-area-inset-top, 42px) 5vw env(safe-area-inset-bottom, 72px);
        flex: 1 0 auto;
      }
      .topbar {
        border-bottom: 1px solid var(--line);
        padding-bottom: 28px;
        margin-bottom: 32px;
      }
      .eyebrow {
        color: var(--orange);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.14em;
        margin: 0 0 10px;
        text-transform: uppercase;
      }
      h1, h2, h3, h4, p {
        margin-top: 0;
      }
      h1, h2 {
        font-family: var(--serif);
        font-weight: 400;
      }
      h1 {
        font-size: clamp(36px, 5vw, 64px);
        line-height: 1.05;
        margin-bottom: 12px;
        color: var(--ink);
      }
      .intro {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 0;
      }
      .panel {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 4px;
        padding: 36px 40px;
        box-shadow: 0 1px 3px rgba(36, 35, 31, 0.04);
      }
      .policy-content h2 {
        font-size: 24px;
        margin-top: 36px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--line);
        color: var(--ink);
      }
      .policy-content h2:first-child {
        margin-top: 0;
      }
      .policy-content h3 {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-top: 24px;
        margin-bottom: 8px;
        color: var(--ink);
      }
      .policy-content h4 {
        font-size: 14px;
        font-weight: 700;
        margin-top: 18px;
        margin-bottom: 6px;
        color: var(--ink);
      }
      .policy-content p {
        font-size: 15px;
        line-height: 1.7;
        margin-bottom: 16px;
        color: var(--ink);
      }
      .policy-content ul, .policy-content ol {
        margin-top: 0;
        margin-bottom: 18px;
        padding-left: 24px;
      }
      .policy-content li {
        font-size: 15px;
        line-height: 1.65;
        margin-bottom: 8px;
        color: var(--ink);
      }
      .policy-content li p {
        margin-bottom: 6px;
      }
      .policy-content strong {
        font-weight: 600;
        color: var(--ink);
      }
      .policy-content a {
        color: var(--orange);
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.15s ease;
      }
      .policy-content a:hover {
        color: #a84725;
      }
      .policy-footer {
        border-top: 1px solid var(--line);
        margin-top: 48px;
        padding-top: 24px;
        color: var(--muted);
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }
      @media (max-width: 640px) {
        .panel {
          padding: 24px 20px;
        }
        .app-shell {
          padding: 24px 16px 48px;
        }
        h1 {
          font-size: 32px;
        }
        .policy-content h2 {
          font-size: 20px;
        }
      }
    </style>
  </head>
  <body>
    <main class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">LEGAL / PRIVACY POLICY</p>
          <h1>${title}</h1>
          ${lastUpdated ? `<p class="intro">${lastUpdated}</p>` : ""}
        </div>
      </header>
      <article class="panel policy-content">
${parsedBody
  .trim()
  .split("\n")
  .map((line) => `        ${line}`)
  .join("\n")}
      </article>
      <footer class="policy-footer">
        <span>Sock Calculator</span>
        <span>${lastUpdated || "Privacy Policy"}</span>
      </footer>
    </main>
  </body>
</html>
`;
}

if (process.argv[1] === __filename) {
  const html = generatePrivacyHtml();
  fs.writeFileSync(outputPath, html, "utf-8");
  console.log(`Successfully generated ${outputPath}`);
}
