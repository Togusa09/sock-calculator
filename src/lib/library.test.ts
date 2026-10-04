// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_RECORD, DEFAULT_YARN_PROFILE } from "./domain";
import {
  deleteItem,
  deleteYarnProfile,
  findTension,
  listItems,
  nextAvailableName,
  saveItem,
  saveTension,
} from "./library";

beforeEach(() => {
  window.localStorage.clear();
});

describe("library storage", () => {
  it("auto-generates the lowest unused numbered name", () => {
    const first = saveItem("measurements", { footLengthCm: 25 });
    const second = saveItem("measurements", { footLengthCm: 26 });

    expect(first.name).toBe("Measurements 01");
    expect(second.name).toBe("Measurements 02");
  });

  it("upserts in place when saving under an existing name", () => {
    const first = saveItem("tension", { stitchesPer10Cm: 30 }, "My gauge");
    const second = saveItem("tension", { stitchesPer10Cm: 32 }, "My gauge");

    const items = listItems("tension");
    expect(items).toHaveLength(1);
    expect(second.id).toBe(first.id);
    expect(items[0].data).toEqual({ stitchesPer10Cm: 32 });
  });

  it("frees a number for reuse after deletion", () => {
    const first = saveItem("construction", { toeStyle: "round" });
    saveItem("construction", { toeStyle: "star" });
    deleteItem("construction", first.id);

    const third = saveItem("construction", { toeStyle: "round" });
    expect(third.name).toBe("Construction 01");
  });

  it("tolerates corrupted localStorage data", () => {
    window.localStorage.setItem(
      "sock-calculator-library-project-v1",
      "{not json",
    );
    expect(listItems("project")).toEqual([]);

    window.localStorage.setItem(
      "sock-calculator-library-project-v1",
      JSON.stringify([{ foo: "bar" }]),
    );
    expect(listItems("project")).toEqual([]);
  });

  it("computes the lowest unused number directly", () => {
    expect(nextAvailableName("project", ["Project 01", "Project 03"])).toBe(
      "Project 02",
    );
  });
});

describe("yarn profile tensions", () => {
  it("finds a tension by profile and needle size and upserts on resave", () => {
    const profile = saveItem("yarnProfile", DEFAULT_YARN_PROFILE);
    saveTension(profile.id, DEFAULT_RECORD.tension, "A");
    saveTension(
      profile.id,
      { ...DEFAULT_RECORD.tension, stitchesPer10Cm: 32 },
      "B",
    );

    expect(listItems("tension")).toHaveLength(1);
    expect(findTension(profile.id, 2.5)?.data.stitchesPer10Cm).toBe(32);
    expect(findTension(profile.id, 3)).toBeUndefined();
    expect(findTension("other", 2.5)).toBeUndefined();
  });

  it("removes a profile's tensions when the profile is deleted", () => {
    const keep = saveItem("yarnProfile", DEFAULT_YARN_PROFILE, "Keep");
    const drop = saveItem("yarnProfile", DEFAULT_YARN_PROFILE, "Drop");
    saveTension(keep.id, DEFAULT_RECORD.tension, "Keep tension");
    saveTension(drop.id, DEFAULT_RECORD.tension, "Drop tension");

    deleteYarnProfile(drop.id);

    expect(listItems("yarnProfile")).toHaveLength(1);
    expect(listItems("tension")).toHaveLength(1);
    expect(findTension(keep.id, 2.5)).toBeDefined();
  });
});
