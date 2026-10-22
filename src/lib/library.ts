import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import type { SavedTension, YarnProfile, YarnTension } from "./domain";

export type LibraryItemType =
  | "measurements"
  | "tension"
  | "construction"
  | "project"
  | "yarnProfile";

export type LibraryItem<T> = {
  id: string;
  name: string;
  schemaVersion: 1;
  updatedAt: string;
  data: T;
};

const storage = createAsyncStorage("appDB");

const STORAGE_PREFIX = "sock-calculator-library-";

const NAME_PREFIXES: Record<LibraryItemType, string> = {
  measurements: "Measurements",
  tension: "Yarn tension",
  construction: "Construction",
  project: "Project",
  yarnProfile: "Yarn profile",
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
export async function listItems<T>(
  type: LibraryItemType,
): Promise<LibraryItem<T>[]> {
  const raw = await storage.getItem(storageKey(type));
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLibraryItem) as LibraryItem<T>[];
  } catch {
    return [];
  }
}

export async function readItem<T>(
  type: LibraryItemType,
  id: string,
): Promise<LibraryItem<T> | undefined> {
  const items = await listItems<T>(type);
  const item = items.find((i) => i.id === id);
  return item;
}

function persist<T>(type: LibraryItemType, items: LibraryItem<T>[]): void {
  storage.setItem(storageKey(type), JSON.stringify(items));
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
export async function saveItem<T>(
  type: LibraryItemType,
  data: T,
  name?: string,
): Promise<LibraryItem<T>> {
  const items = await listItems<T>(type);
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

/** True when another item of this type (ignoring `exceptId`) already uses the name. */
export async function isNameTaken(
  type: LibraryItemType,
  name: string,
  exceptId?: string,
): Promise<boolean> {
  const wanted = name.trim().toLowerCase();
  return (await listItems(type)).some(
    (item) => item.id !== exceptId && item.name.trim().toLowerCase() === wanted,
  );
}

/** Updates an existing item in place by id, allowing a rename. Returns undefined if the id is unknown. */
export async function updateItem<T>(
  type: LibraryItemType,
  id: string,
  name: string,
  data: T,
): Promise<LibraryItem<T> | undefined> {
  const items = await listItems<T>(type);
  if (!items.some((item) => item.id === id)) return undefined;
  const updated: LibraryItem<T> = {
    id,
    name: name.trim(),
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    data,
  };
  persist(
    type,
    items.map((item) => (item.id === id ? updated : item)),
  );
  return updated;
}

export async function deleteItem(
  type: LibraryItemType,
  id: string,
): Promise<void> {
  const items = await listItems(type);
  persist(
    type,
    items.filter((item) => item.id !== id),
  );
}

const NEEDLE_TOLERANCE_MM = 0.01;

export async function findTension(
  yarnProfileId: string,
  needleSizeMm: number,
): Promise<LibraryItem<SavedTension> | undefined> {
  const items = await listItems<SavedTension>("tension");
  return items.find(
    (item) =>
      item.data.yarnProfileId === yarnProfileId &&
      Math.abs(item.data.needleSizeMm - needleSizeMm) < NEEDLE_TOLERANCE_MM,
  );
}

/** Saves a tension, replacing any existing one for the same profile and needle size. */
export async function saveTension(
  yarnProfileId: string,
  tension: YarnTension,
  name: string,
): Promise<LibraryItem<SavedTension>> {
  const data: SavedTension = { ...tension, yarnProfileId };
  const existing = await findTension(yarnProfileId, tension.needleSizeMm);
  return saveItem<SavedTension>("tension", data, existing?.name ?? name);
}

/** Deletes a yarn profile along with every tension that references it. */
export async function deleteYarnProfile(id: string): Promise<void> {
  await deleteItem("yarnProfile", id);
  const tensions = await listItems<SavedTension>("tension");
  persist(
    "tension",
    tensions.filter((item) => item.data.yarnProfileId !== id),
  );
}

export function describeYarnProfile(profile: YarnProfile): string {
  const mix = profile.materials
    .map((m) => `${m.percent}% ${m.material}`)
    .join(", ");
  return `${profile.manufacturer} ${profile.weight} (${mix})`;
}
