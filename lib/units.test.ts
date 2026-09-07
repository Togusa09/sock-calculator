import { describe, expect, it } from "vitest";
import { formatMeasurement, fromCentimetres, measurementLabel, toCentimetres } from "./units";

describe("unit conversions", () => {
  it("round-trips imperial measurements through canonical centimetres", () => {
    const centimetres = toCentimetres(12.5, "imperial");

    expect(centimetres).toBeCloseTo(31.75);
    expect(fromCentimetres(centimetres, "imperial")).toBeCloseTo(12.5);
  });

  it("leaves metric values unchanged", () => {
    expect(toCentimetres(25, "metric")).toBe(25);
    expect(fromCentimetres(25, "metric")).toBe(25);
  });

  it("formats values using the selected display unit", () => {
    expect(formatMeasurement(31.75, "imperial")).toBe("12.5 in");
    expect(formatMeasurement(31.75, "metric")).toBe("31.8 cm");
    expect(measurementLabel("imperial")).toBe("in");
  });
});