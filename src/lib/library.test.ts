import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { DEFAULT_RECORD, DEFAULT_YARN_PROFILE } from "./domain";
import {
  deleteItem,
  deleteYarnProfile,
  findTension,
  isNameTaken,
  listItems,
  nextAvailableName,
  saveItem,
  saveTension,
  updateItem,
} from "./library";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest"),
);

const storage = createAsyncStorage("appDB");

beforeEach(() => {
  // clearAllMockStorages();
  storage.clear();
});

// beforeEach(() => {
//   // Type the store explicitly to avoid 'implicit any' errors
//   let store: Record<string, string> = {};

//   // Mock the localStorage methods matching the Storage interface signature
//   const localStorageMock: Partial<Storage> = {
//     getItem: jest.fn((key: string): string | null => store[key] || null),
//     setItem: jest.fn((key: string, value: string): void => {
//       store[key] = value.toString();
//     }),
//     removeItem: jest.fn((key: string): void => {
//       delete store[key];
//     }),
//     clear: jest.fn(() => {
//       store = {};
//     }),
//   };

//   // Safely cast to unknown then Storage to satisfy Object.defineProperty
//   Object.defineProperty(window, "localStorage", {
//     value: localStorageMock as Storage,
//     writable: true,
//   });
// });

// afterEach(() => {
//   jest.clearAllMocks();
// });

describe("library storage", () => {
  it("auto-generates the lowest unused numbered name", async () => {
    const first = await saveItem("measurements", { footLengthCm: 25 });
    const second = await saveItem("measurements", { footLengthCm: 26 });

    expect(first.name).toBe("Measurements 01");
    expect(second.name).toBe("Measurements 02");
  });

  it("upserts in place when saving under an existing name", async () => {
    const first = await saveItem(
      "tension",
      { stitchesPer10Cm: 30 },
      "My gauge",
    );
    const second = await saveItem(
      "tension",
      { stitchesPer10Cm: 32 },
      "My gauge",
    );

    const items = await listItems("tension");
    expect(items).toHaveLength(1);
    expect(second.id).toBe(first.id);
    expect(items[0].data).toEqual({ stitchesPer10Cm: 32 });
  });

  it("frees a number for reuse after deletion", async () => {
    const first = await saveItem("construction", { toeStyle: "round" });
    await saveItem("construction", { toeStyle: "star" });
    await deleteItem("construction", first.id);

    const third = await saveItem("construction", { toeStyle: "round" });
    expect(third.name).toBe("Construction 01");
  });

  it("tolerates corrupted localStorage data", async () => {
    await storage.setItem("sock-calculator-library-project-v1", "{not json");
    expect(await listItems("project")).toEqual([]);

    await storage.setItem(
      "sock-calculator-library-project-v1",
      JSON.stringify([{ foo: "bar" }]),
    );
    expect(await listItems("project")).toEqual([]);
  });

  it("computes the lowest unused number directly", () => {
    expect(nextAvailableName("project", ["Project 01", "Project 03"])).toBe(
      "Project 02",
    );
  });
});

describe("yarn profile tensions", () => {
  it("finds a tension by profile and needle size and upserts on resave", async () => {
    const profile = await saveItem("yarnProfile", DEFAULT_YARN_PROFILE);
    await saveTension(profile.id, DEFAULT_RECORD.tension, "A");
    await saveTension(
      profile.id,
      { ...DEFAULT_RECORD.tension, stitchesPer10Cm: 32 },
      "B",
    );

    expect(await listItems("tension")).toHaveLength(1);
    expect((await findTension(profile.id, 2.5))?.data.stitchesPer10Cm).toBe(32);
    expect(await findTension(profile.id, 3)).toBeUndefined();
    expect(await findTension("other", 2.5)).toBeUndefined();
  });

  it("removes a profile's tensions when the profile is deleted", async () => {
    const keep = await saveItem("yarnProfile", DEFAULT_YARN_PROFILE, "Keep");
    const drop = await saveItem("yarnProfile", DEFAULT_YARN_PROFILE, "Drop");
    await saveTension(keep.id, DEFAULT_RECORD.tension, "Keep tension");
    await saveTension(drop.id, DEFAULT_RECORD.tension, "Drop tension");

    await deleteYarnProfile(drop.id);

    expect(await listItems("yarnProfile")).toHaveLength(1);
    expect(await listItems("tension")).toHaveLength(1);
    expect(findTension(keep.id, 2.5)).toBeDefined();
  });
});

describe("updateItem and isNameTaken", () => {
  it("renames in place by id without duplicating", async () => {
    const item = await saveItem("measurements", { footLengthCm: 25 }, "Old");
    const updated = await updateItem("measurements", item.id, " New ", {
      footLengthCm: 27,
    });

    expect(updated?.name).toBe("New");
    expect(await listItems("measurements")).toHaveLength(1);
    expect(await readItemData(item.id)).toEqual({ footLengthCm: 27 });
  });

  it("returns undefined for an unknown id", async () => {
    expect(
      await updateItem("measurements", "missing", "x", {}),
    ).toBeUndefined();
  });

  it("detects name clashes, ignoring the item being edited", async () => {
    const a = await saveItem("yarnProfile", {}, "Alpha");
    await saveItem("yarnProfile", {}, "Beta");

    expect(await isNameTaken("yarnProfile", "beta")).toBe(true);
    expect(await isNameTaken("yarnProfile", "Alpha", a.id)).toBe(false);
    expect(await isNameTaken("yarnProfile", "Gamma")).toBe(false);
  });
});

async function readItemData(id: string) {
  const items = await listItems("measurements");
  return items.find((i) => i.id === id)?.data;
}
