export type LibraryItemType =
  "measurements" | "tension" | "construction" | "project";

export type LibraryItem<T> = {
  id: string;
  name: string;
  schemaVersion: 1;
  updatedAt: string;
  data: T;
};

const STORAGE_PREFIX = "sock-calculator-library-";

const NAME_PREFIXES: Record<LibraryItemType, string> = {
  measurements: "Measurements",
  tension: "Yarn tension",
  construction: "Construction",
  project: "Project",
};

function storageKey(type: LibraryItemType): string {
  return `${STORAGE_PREFIX}${type}-v1`;
}

function isLibraryItem(value: unknown): value is LibraryItem<unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    "id" in value &&
    "name" in value &&
    "schemaVersion" in value &&
    "data" in value
  );
}

/** Reads and parses the stored array, dropping anything unparsable rather than throwing. */
export function listItems<T>(type: LibraryItemType): LibraryItem<T>[] {
  const raw = window.localStorage.getItem(storageKey(type));
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLibraryItem) as LibraryItem<T>[];
  } catch {
    return [];
  }
}

function persist<T>(type: LibraryItemType, items: LibraryItem<T>[]): void {
  window.localStorage.setItem(storageKey(type), JSON.stringify(items));
}

/** Finds the lowest two-digit number not already used by an existing "<prefix> NN" name. */
export function nextAvailableName(
  type: LibraryItemType,
  existingNames: string[],
): string {
  const prefix = NAME_PREFIXES[type];
  const pattern = new RegExp(`^${prefix} (\\d{2,})$`);
  const usedNumbers = new Set(
    existingNames
      .map((name) => name.match(pattern)?.[1])
      .filter((value): value is string => value !== undefined)
      .map(Number),
  );
  let candidate = 1;
  while (usedNumbers.has(candidate)) candidate += 1;
  return `${prefix} ${String(candidate).padStart(2, "0")}`;
}

/** Saves as a new item, or upserts in place when `name` matches an existing item. */
export function saveItem<T>(
  type: LibraryItemType,
  data: T,
  name?: string,
): LibraryItem<T> {
  const items = listItems<T>(type);
  const resolvedName =
    name?.trim() ||
    nextAvailableName(
      type,
      items.map((item) => item.name),
    );
  const existing = items.find((item) => item.name === resolvedName);
  const saved: LibraryItem<T> = {
    id: existing?.id ?? window.crypto.randomUUID(),
    name: resolvedName,
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    data,
  };
  const nextItems = existing
    ? items.map((item) => (item.id === existing.id ? saved : item))
    : [...items, saved];
  persist(type, nextItems);
  return saved;
}

export function deleteItem(type: LibraryItemType, id: string): void {
  const items = listItems(type);
  persist(
    type,
    items.filter((item) => item.id !== id),
  );
}
