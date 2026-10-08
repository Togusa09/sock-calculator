import { describe, expect, it } from "vitest";
import { DEFAULT_RECORD } from "./domain";
import {
  describeConstruction,
  describeMeasurements,
  describeTension,
} from "./compactDetails";

describe("compactDetails", () => {
  it("lists only measurements that are set", () => {
    const rows = describeMeasurements(DEFAULT_RECORD.measurements);
    expect(rows.map((r) => r[0])).toEqual([
      "Foot length",
      "Circumference",
      "Toe length",
    ]);
    expect(rows[0][1]).toBe("25.0 cm");
  });

  it("describes tension and construction", () => {
    expect(
      describeTension({ ...DEFAULT_RECORD.tension, yarnProfileId: "x" })[2],
    ).toEqual(["Needle", "2.5 mm"]);
    expect(describeConstruction(DEFAULT_RECORD.construction)).toHaveLength(4);
    expect(
      describeConstruction({
        ...DEFAULT_RECORD.construction,
        heelFlapRows: 20,
      }),
    ).toContainEqual(["Heel flap rows", "20"]);
  });
});
