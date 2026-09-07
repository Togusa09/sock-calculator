export type DisplayUnit = "metric" | "imperial";
export type Ribbing = "1x1" | "1x2" | "2x2" | "3x3";
export type CuffStyle = "ribbed" | "folded";
export type HeelStyle = "gussetted" | "afterthought" | "short-row";
export type ToeStyle = "round" | "star";

export type MeasurementValue = {
  value: number;
  source: "entered" | "calculated";
};

export type Measurements = {
  footLengthCm: number;
  footCircumferenceCm: number;
  heelDiagonalCm?: number;
  ankleCircumferenceCm?: number;
  heelHeightCm?: number;
  instepCircumferenceCm?: number;
  toeLengthCm?: number;
  lowCalfCircumferenceCm?: number;
  highCalfCircumferenceCm?: number;
};

export type YarnTension = {
  stitchesPer10Cm: number;
  rowsPer10Cm: number;
  needleSizeMm: number;
  negativeEasePercent: number;
};

export type ConstructionOptions = {
  ribbing: Ribbing;
  cuffStyle: CuffStyle;
  heelStyle: HeelStyle;
  toeStyle: ToeStyle;
  heelFlapRows?: number;
  toeLengthCm?: number;
  negativeEasePercent?: number;
};

export type CalculatorRecord = {
  schemaVersion: 1;
  displayUnit: DisplayUnit;
  measurements: Measurements;
  tension: YarnTension;
  construction: ConstructionOptions;
};

export type DerivedMeasurements = {
  ankleCircumference: MeasurementValue;
  heelHeight: MeasurementValue;
  instepCircumference: MeasurementValue;
  toeLength: MeasurementValue;
  lowCalfCircumference: MeasurementValue;
  highCalfCircumference: MeasurementValue;
};

export type FootSizeResult = {
  targetCircumferenceCm: number;
  derived: DerivedMeasurements;
};

export type FitResult = {
  easedCircumferenceCm: number;
  baseStitches: number;
  roundedStitches: number;
  easePercent: number;
};

export type CuffCalculation = {
  stitches: number;
  lengthCm: number;
  detail: string;
};

export type HeelCalculation = {
  stitches: number;
  lengthCm: number;
  heelFlapRows: number;
  detail: string;
  heelFlapStitches: number;
  instepStitches: number;
  heelTurnStitches: number;
  targetGussetStitches: number;
  pickupStitches: number;
  pickupsPerSide: number;
};

export type ToeCalculation = {
  finalStitches: number;
  lengthCm: number;
  detail: string;
};

export type ConstructionCalculation = {
  cuff: CuffCalculation;
  leg: { stitches: number; lengthCm: number };
  heel: HeelCalculation;
  foot: { stitches: number; lengthCm: number };
  toe: ToeCalculation;
};

export const DEFAULT_RECORD: CalculatorRecord = {
  schemaVersion: 1,
  displayUnit: "metric",
  measurements: { footLengthCm: 25, footCircumferenceCm: 22, toeLengthCm: 5 },
  tension: {
    stitchesPer10Cm: 30,
    rowsPer10Cm: 42,
    needleSizeMm: 2.5,
    negativeEasePercent: 10,
  },
  construction: {
    ribbing: "2x2",
    cuffStyle: "ribbed",
    heelStyle: "gussetted",
    toeStyle: "round",
  },
};

export const RIBBING_REPEAT: Record<Ribbing, number> = {
  "1x1": 2,
  "1x2": 3,
  "2x2": 4,
  "3x3": 6,
};
