import { describe, expect, it } from "vitest";
import { calculateStitches } from "./calculations";
import { DEFAULT_RECORD, type CalculatorRecord } from "./domain";

function recordWithHeelDiagonal(heelDiagonalCm: number): CalculatorRecord {
  return {
    ...DEFAULT_RECORD,
    measurements: {
      ...DEFAULT_RECORD.measurements,
      heelDiagonalCm,
    },
  };
}

describe("gussetted heel flap", () => {
  it("changes the flap row count when the heel diagonal changes", () => {
    const shorterDiagonal = calculateStitches(recordWithHeelDiagonal(25.4));
    const longerDiagonal = calculateStitches(recordWithHeelDiagonal(31.75));

    expect(shorterDiagonal.sections.heel.heelFlapRows).toBe(15);
    expect(longerDiagonal.sections.heel.heelFlapRows).toBe(27);
    expect(longerDiagonal.sections.heel.heelFlapRows).toBeGreaterThan(shorterDiagonal.sections.heel.heelFlapRows);
  });

  it("keeps flap stitch width separate from the diagonal-derived row count", () => {
    const result = calculateStitches(recordWithHeelDiagonal(31.75));

    expect(result.sections.heel.heelFlapStitches).toBe(30);
    expect(result.sections.heel.heelFlapRows).toBe(27);
  });

  it("uses an explicit flap row override instead of the calculated row count", () => {
    const record = recordWithHeelDiagonal(31.75);
    record.construction = {
      ...record.construction,
      heelFlapRows: 32,
    };

    expect(calculateStitches(record).sections.heel.heelFlapRows).toBe(32);
  });
});