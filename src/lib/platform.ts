/**
 * Platform abstraction layer for cross-platform file operations.
 * Routes export/import operations based on Capacitor platform availability.
 * Native builds use share/file APIs; web uses browser download/upload.
 */

export type ExportFormat = "json";

interface ExportOptions {
  data: unknown;
}

interface ImportSource {
  file?: File;
  url?: string;
  text?: string;
}

/** Export data as file using platform-specific API */
export async function exportData(options: ExportOptions): Promise<void> {
  // Always use browser-based download for simplicity and consistency
  // Native share plugin can be added later if needed
  await downloadFile(options.data as Record<string, unknown>, ".json");
}

/** Helper function for browser download (used by web and native fallback) */
async function downloadFile(
  data: Record<string, unknown>,
  extension: string,
): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `sock-calc-${Date.now()}${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Import data from platform-specific source */
export async function importData(
  source: ImportSource,
): Promise<Record<string, unknown>> {
  if (source.text) {
    return JSON.parse(source.text);
  }

  if (source.url) {
    const response = await fetch(source.url);
    const contentType = response.headers.get("content-type");
    // Validate CORS and content type for external imports
    if (!response.ok || !contentType?.includes("application/json")) {
      throw new Error("Invalid or blocked import source");
    }
    return await response.json();
  }

  if (source.file) {
    const text = await source.file.text();
    return JSON.parse(text);
  }

  throw new Error("No import source provided");
}
