import { describe, expect, it } from "vitest";
import { DEFAULT_RECORD, type CalculatorRecord } from "./domain";
import { parseImportedRecord, validateRecord } from "./validation";

describe("record validation", () => {
  it("accepts the default record and valid JSON export", () => {
    const json = JSON.stringify(DEFAULT_RECORD);

    expect(validateRecord(DEFAULT_RECORD)).toEqual([]);
    expect(parseImportedRecord(json)).toEqual(DEFAULT_RECORD);
  });

  it("rejects invalid required values", () => {
    const record: CalculatorRecord = {
      ...DEFAULT_RECORD,
      measurements: { ...DEFAULT_RECORD.measurements, footLengthCm: 0 },
      tension: { ...DEFAULT_RECORD.tension, negativeEasePercent: 100 },
    };

    expect(validateRecord(record)).toEqual([
      "Foot length must be greater than zero.",
      "Negative ease must be between 0 and 99%.",
    ]);
  });

  it("validates yarn profile material mixes", () => {
    const profile = {
      manufacturer: "Acme",
      weight: "DK" as const,
      materials: [
        { material: "Wool", percent: 75 },
        { material: "Acrylic", percent: 25 },
      ],
    };

    expect(validateRecord({ ...DEFAULT_RECORD, yarnProfile: profile })).toEqual(
      [],
    );
    expect(
      validateRecord({
        ...DEFAULT_RECORD,
        yarnProfile: {
          ...profile,
          manufacturer: " ",
          materials: [{ material: "Wool", percent: 60 }],
        },
      }),
    ).toEqual([
      "Yarn manufacturer is required.",
      "Material percentages must add up to 100%.",
    ]);
  });

  it("rejects unsupported record versions and malformed JSON", () => {
    const unsupported = JSON.stringify({ ...DEFAULT_RECORD, schemaVersion: 3 });

    expect(() => parseImportedRecord(unsupported)).toThrow(
      "This calculator record version is not supported.",
    );
    expect(() => parseImportedRecord("not json")).toThrow();
  });
});
