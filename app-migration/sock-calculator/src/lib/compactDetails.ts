import type {
  ConstructionOptions,
  Measurements,
  SavedTension,
  YarnProfile,
} from "./domain";
import { formatMeasurement } from "./units";

export type DetailRow = [label: string, value: string];

const cm = (value: number) => formatMeasurement(value, "metric");

export function describeMeasurements(m: Measurements): DetailRow[] {
  const optional: [string, number | undefined][] = [
    ["Heel diagonal", m.heelDiagonalCm],
    ["Ankle", m.ankleCircumferenceCm],
    ["Heel height", m.heelHeightCm],
    ["Instep", m.instepCircumferenceCm],
    ["Toe length", m.toeLengthCm],
    ["Low calf", m.lowCalfCircumferenceCm],
    ["High calf", m.highCalfCircumferenceCm],
  ];
  return [
    ["Foot length", cm(m.footLengthCm)],
    ["Circumference", cm(m.footCircumferenceCm)],
    ...optional
      .filter((row): row is [string, number] => row[1] !== undefined)
      .map(([label, value]): DetailRow => [label, cm(value)]),
  ];
}

export function describeYarn(y: YarnProfile): DetailRow[] {
  return [
    ["Manufacturer", y.manufacturer || "—"],
    ["Weight", y.weight],
    [
      "Materials",
      y.materials.map((m) => `${m.percent}% ${m.material}`).join(", "),
    ],
  ];
}

export function describeTension(t: SavedTension): DetailRow[] {
  return [
    ["Stitches", `${t.stitchesPer10Cm} per 10 cm`],
    ["Rows", `${t.rowsPer10Cm} per 10 cm`],
    ["Needle", `${t.needleSizeMm} mm`],
    ["Negative ease", `${t.negativeEasePercent}%`],
  ];
}

export function describeConstruction(c: ConstructionOptions): DetailRow[] {
  const rows: DetailRow[] = [
    ["Ribbing", c.ribbing],
    ["Cuff", c.cuffStyle],
    ["Heel", c.heelStyle],
    ["Toe", c.toeStyle],
  ];
  if (c.heelFlapRows !== undefined)
    rows.push(["Heel flap rows", String(c.heelFlapRows)]);
  if (c.toeLengthCm !== undefined) rows.push(["Toe length", cm(c.toeLengthCm)]);
  if (c.negativeEasePercent !== undefined)
    rows.push(["Ease override", `${c.negativeEasePercent}%`]);
  return rows;
}
