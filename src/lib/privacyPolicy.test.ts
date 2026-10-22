import fs from "node:fs";
import path from "node:path";

// import { generatePrivacyHtml } from "../../scripts/build-privacy-html.mjs";

describe("Privacy Policy Static HTML", () => {
  const rootDir = path.resolve(__dirname, "../..");
  const htmlPath = path.join(rootDir, "public", "PrivacyPolicy.html");
  const markdownPath = path.join(rootDir, "content", "PrivacyPolicy.md");

  it("exists and is a valid standalone HTML5 document", () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
    const html = fs.readFileSync(htmlPath, "utf-8");
    expect(html.trim().startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('name="viewport"');
    expect(html).toContain("viewport-fit=cover");
  });

  it("embeds design tokens and styling consistent with the app", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    expect(html).toContain("<style>");
    expect(html).toContain("--ink: #24231f");
    expect(html).toContain("--paper: #f4f1ea");
    expect(html).toContain("--panel: #fffdf8");
    expect(html).toContain("--line: #ddd8ca");
    expect(html).toContain("--orange: #c75b36");
    expect(html).toContain("--serif:");
    expect(html).toContain("--font-geist-sans:");
    expect(html).toContain(".app-shell");
    expect(html).toContain(".topbar");
    expect(html).toContain(".panel");
  });

  it("contains zero <script> tags to ensure maximum availability", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  it("contains required legal sections and contact details", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    expect(html).toContain("Privacy Policy");
    expect(html).toContain("Last updated: October 16, 2026");
    expect(html).toContain("Interpretation and Definitions");
    expect(html).toContain("Collecting and Using Your Personal Information");
    expect(html).toContain("Retention of Your Personal Data");
    expect(html).toContain("Children&#39;s and Minors&#39; Privacy");
    expect(html).toContain("anarksoft@gmail.com");
  });

  // it("matches the generated output from content/PrivacyPolicy.md without drift", () => {
  //   const markdown = fs.readFileSync(markdownPath, "utf-8");
  //   const expectedHtml = generatePrivacyHtml(markdown);
  //   const actualHtml = fs.readFileSync(htmlPath, "utf-8");
  //   expect(actualHtml).toBe(expectedHtml);
  // });
});
