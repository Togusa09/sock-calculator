import { describe, expect, it } from "vitest";
import {
  calculateFit,
  calculateFootSize,
  calculateStitches,
} from "./calculations";
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

    expect(shorterDiagonal.sections.heel.heelFlapRows).toBe(22);
    expect(longerDiagonal.sections.heel.heelFlapRows).toBe(40);
    expect(longerDiagonal.sections.heel.heelFlapRows).toBeGreaterThan(
      shorterDiagonal.sections.heel.heelFlapRows,
    );
  });

  it("keeps flap stitch width separate from the diagonal-derived row count", () => {
    const result = calculateStitches(recordWithHeelDiagonal(31.75));

    expect(result.sections.heel.heelFlapStitches).toBe(30);
    expect(result.sections.heel.heelFlapRows).toBe(40);
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

describe("foot-size stage", () => {
  it("uses calculated optional measurements when they are omitted", () => {
    const result = calculateFootSize(DEFAULT_RECORD);

    expect(result.targetCircumferenceCm).toBe(22);
    expect(result.derived.ankleCircumference.value).toBeCloseTo(20.24);
    expect(result.derived.ankleCircumference.source).toBe("calculated");
    expect(result.derived.heelHeight.value).toBeCloseTo(7);
    expect(result.derived.heelHeight.source).toBe("calculated");
    expect(result.derived.toeLength).toEqual({ value: 5, source: "entered" });
  });

  it("preserves explicit optional measurements over calculated values", () => {
    const record: CalculatorRecord = {
      ...DEFAULT_RECORD,
      measurements: {
        ...DEFAULT_RECORD.measurements,
        ankleCircumferenceCm: 21.5,
        heelHeightCm: 6.25,
      },
    };

    const result = calculateFootSize(record);

    expect(result.derived.ankleCircumference).toEqual({
      value: 21.5,
      source: "entered",
    });
    expect(result.derived.heelHeight).toEqual({
      value: 6.25,
      source: "entered",
    });
  });
});

describe("fit stage", () => {
  it("uses a project ease override instead of yarn ease", () => {
    const record: CalculatorRecord = {
      ...DEFAULT_RECORD,
      construction: { ...DEFAULT_RECORD.construction, negativeEasePercent: 20 },
    };

    const result = calculateFit(record, calculateFootSize(record));

    expect(result.easePercent).toBe(20);
    expect(result.easedCircumferenceCm).toBe(17.6);
    expect(result.baseStitches).toBeCloseTo(52.8);
    expect(result.roundedStitches).toBe(52);
  });

  it.each([
    ["1x1", 10],
    ["1x2", 9],
    ["2x2", 12],
    ["3x3", 12],
  ] as const)("rounds a base count to the %s repeat", (ribbing, expected) => {
    const record: CalculatorRecord = {
      ...DEFAULT_RECORD,
      measurements: { ...DEFAULT_RECORD.measurements, footCircumferenceCm: 10 },
      tension: {
        ...DEFAULT_RECORD.tension,
        stitchesPer10Cm: 10,
        negativeEasePercent: 0,
      },
      construction: { ...DEFAULT_RECORD.construction, ribbing },
    };

    expect(
      calculateFit(record, calculateFootSize(record)).roundedStitches,
    ).toBe(expected);
  });
});

describe("construction definitions", () => {
  it("calculates folded cuffs independently from ribbed cuffs", () => {
    const ribbed = calculateStitches(DEFAULT_RECORD);
    const folded = calculateStitches({
      ...DEFAULT_RECORD,
      construction: { ...DEFAULT_RECORD.construction, cuffStyle: "folded" },
    });

    expect(ribbed.sections.cuff.lengthCm).toBe(5);
    expect(folded.sections.cuff.lengthCm).toBe(6);
  });

  it("selects afterthought and short-row heel definitions", () => {
    const afterthought = calculateStitches({
      ...DEFAULT_RECORD,
      construction: {
        ...DEFAULT_RECORD.construction,
        heelStyle: "afterthought",
      },
    });
    const shortRow = calculateStitches({
      ...DEFAULT_RECORD,
      construction: { ...DEFAULT_RECORD.construction, heelStyle: "short-row" },
    });

    expect(afterthought.sections.heel.detail).toContain("Afterthought");
    expect(shortRow.sections.heel.detail).toContain("Short-row");
    expect(afterthought.sections.heel.heelFlapRows).toBe(0);
    expect(shortRow.sections.heel.heelFlapRows).toBe(0);
  });

  it("selects round and star toe definitions", () => {
    const round = calculateStitches(DEFAULT_RECORD);
    const star = calculateStitches({
      ...DEFAULT_RECORD,
      construction: { ...DEFAULT_RECORD.construction, toeStyle: "star" },
    });

    expect(round.sections.toe.finalStitches).toBe(20);
    expect(star.sections.toe.finalStitches).toBe(8);
  });
});
