import { calculateConstruction, roundStitchesToRibbing } from "./constructions";
import type {
  CalculatorRecord,
  DerivedMeasurements,
  FitResult,
  FootSizeResult,
  MeasurementValue,
} from "./domain";

const DEFAULT_HEEL_HEIGHT_RATIO = 0.28;
const DEFAULT_TOE_LENGTH_RATIO = 0.2;
const DEFAULT_ANKLE_RATIO = 0.92;
const DEFAULT_LOW_CALF_RATIO = 1.08;
const DEFAULT_HIGH_CALF_RATIO = 1.16;

function derivedOrEntered(
  entered: number | undefined,
  calculated: number,
): MeasurementValue {
  return entered === undefined
    ? { value: calculated, source: "calculated" }
    : { value: entered, source: "entered" };
}

/** Stage 1: model the wearer's foot and leg in canonical centimetres. */
export function calculateFootSize(record: CalculatorRecord): FootSizeResult {
  const { measurements } = record;
  const foot = measurements.footCircumferenceCm;
  const derived: DerivedMeasurements = {
    ankleCircumference: derivedOrEntered(
      measurements.ankleCircumferenceCm,
      foot * DEFAULT_ANKLE_RATIO,
    ),
    heelHeight: derivedOrEntered(
      measurements.heelHeightCm,
      measurements.footLengthCm * DEFAULT_HEEL_HEIGHT_RATIO,
    ),
    instepCircumference: derivedOrEntered(
      measurements.instepCircumferenceCm,
      foot,
    ),
    toeLength: derivedOrEntered(
      measurements.toeLengthCm,
      measurements.footLengthCm * DEFAULT_TOE_LENGTH_RATIO,
    ),
    lowCalfCircumference: derivedOrEntered(
      measurements.lowCalfCircumferenceCm,
      foot * DEFAULT_LOW_CALF_RATIO,
    ),
    highCalfCircumference: derivedOrEntered(
      measurements.highCalfCircumferenceCm,
      foot * DEFAULT_HIGH_CALF_RATIO,
    ),
  };

  return { targetCircumferenceCm: foot, derived };
}

/** Stage 2: apply ease, gauge, and ribbing constraints to the foot-size model. */
export function calculateFit(
  record: CalculatorRecord,
  footSize: FootSizeResult,
): FitResult {
  const easePercent =
    record.construction.negativeEasePercent ??
    record.tension.negativeEasePercent;
  const easedCircumferenceCm =
    footSize.targetCircumferenceCm * (1 - easePercent / 100);
  const baseStitches =
    (easedCircumferenceCm * record.tension.stitchesPer10Cm) / 10;

  return {
    easedCircumferenceCm,
    baseStitches,
    roundedStitches: roundStitchesToRibbing(
      baseStitches,
      record.construction.ribbing,
    ),
    easePercent,
  };
}

/** Stage 3: fit the selected cuff, heel, leg, foot, and toe constructions. */
export function calculateStitches(record: CalculatorRecord) {
  const footSize = calculateFootSize(record);
  const fit = calculateFit(record, footSize);
  const sections = calculateConstruction(record, fit, footSize.derived);

  return {
    targetCircumferenceCm: footSize.targetCircumferenceCm,
    easedCircumferenceCm: fit.easedCircumferenceCm,
    baseStitches: fit.baseStitches,
    roundedStitches: fit.roundedStitches,
    easePercent: fit.easePercent,
    derived: footSize.derived,
    sections,
  };
}
