// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { deleteItem, listItems, nextAvailableName, saveItem } from "./library";

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
