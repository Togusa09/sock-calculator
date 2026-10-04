import type { DisplayUnit } from "./domain";

export const CM_PER_INCH = 2.54;

export function toCentimetres(value: number, unit: DisplayUnit): number {
  return unit === "metric" ? value : value * CM_PER_INCH;
}

export function fromCentimetres(value: number, unit: DisplayUnit): number {
  return unit === "metric" ? value : value / CM_PER_INCH;
}

export function formatMeasurement(valueCm: number, unit: DisplayUnit): string {
  return `${fromCentimetres(valueCm, unit).toFixed(1)} ${unit === "metric" ? "cm" : "in"}`;
}

export function measurementLabel(unit: DisplayUnit): string {
  return unit === "metric" ? "cm" : "in";
}
