import { RIBBING_REPEAT, type CalculatorRecord, type DerivedMeasurements, type MeasurementValue } from "./domain";

const DEFAULT_HEEL_HEIGHT_RATIO = 0.28;
const DEFAULT_TOE_LENGTH_RATIO = 0.2;
const DEFAULT_ANKLE_RATIO = 0.92;
const DEFAULT_LOW_CALF_RATIO = 1.08;
const DEFAULT_HIGH_CALF_RATIO = 1.16;

function derivedOrEntered(entered: number | undefined, calculated: number): MeasurementValue {
  return entered === undefined ? { value: calculated, source: "calculated" } : { value: entered, source: "entered" };
}

export function calculateFootSize(record: CalculatorRecord): DerivedMeasurements {
  const { measurements } = record;
  const foot = measurements.footCircumferenceCm;
  return {
    ankleCircumference: derivedOrEntered(measurements.ankleCircumferenceCm, foot * DEFAULT_ANKLE_RATIO),
    heelHeight: derivedOrEntered(measurements.heelHeightCm, measurements.footLengthCm * DEFAULT_HEEL_HEIGHT_RATIO),
    instepCircumference: derivedOrEntered(measurements.instepCircumferenceCm, foot),
    toeLength: derivedOrEntered(measurements.toeLengthCm, measurements.footLengthCm * DEFAULT_TOE_LENGTH_RATIO),
    lowCalfCircumference: derivedOrEntered(measurements.lowCalfCircumferenceCm, foot * DEFAULT_LOW_CALF_RATIO),
    highCalfCircumference: derivedOrEntered(measurements.highCalfCircumferenceCm, foot * DEFAULT_HIGH_CALF_RATIO),
  };
}

function roundToRepeat(stitches: number, repeat: number): number {
  return Math.max(repeat, Math.round(stitches / repeat) * repeat);
}

export function calculateStitches(record: CalculatorRecord) {
  const { measurements, tension, construction } = record;
  const derived = calculateFootSize(record);
  const easePercent = construction.negativeEasePercent ?? tension.negativeEasePercent;
  const easedCircumferenceCm = measurements.footCircumferenceCm * (1 - easePercent / 100);
  const baseStitches = easedCircumferenceCm * tension.stitchesPer10Cm / 10;
  const roundedStitches = roundToRepeat(baseStitches, RIBBING_REPEAT[construction.ribbing]);
  const toeLengthCm = construction.toeLengthCm ?? derived.toeLength.value;
  const heelLengthCm = derived.heelHeight.value;
  const heelFlapStitches = Math.max(1, Math.round(roundedStitches / 2));
  const instepStitches = roundedStitches - heelFlapStitches;
  const heelTurnStitches = Math.round(heelFlapStitches / 2) + 2;
  const targetGussetStitches = measurements.heelDiagonalCm === undefined
    ? roundedStitches
    : Math.max(1, Math.round(measurements.heelDiagonalCm * (1 - easePercent / 100) * tension.stitchesPer10Cm / 10));
  const pickupStitches = Math.max(0, targetGussetStitches - instepStitches - heelTurnStitches);
  const pickupsPerSide = pickupStitches / 2;
  const heelFlapLengthCm = construction.heelStyle === "gussetted"
    ? pickupsPerSide * 10 / tension.stitchesPer10Cm
    : heelLengthCm;
  const heelStitches = construction.heelStyle === "gussetted" ? heelFlapStitches : roundedStitches;
  const toeFinalStitches = construction.toeStyle === "star" ? 8 : Math.max(8, Math.round(roundedStitches / 3));

  return {
    targetCircumferenceCm: measurements.footCircumferenceCm,
    easedCircumferenceCm,
    baseStitches,
    roundedStitches,
    easePercent,
    derived,
    sections: {
      cuff: { stitches: roundedStitches, lengthCm: construction.cuffStyle === "folded" ? 6 : 5, detail: construction.cuffStyle === "folded" ? "Folded cuff: 6 cm default" : `${construction.ribbing} rib: 5 cm default` },
      leg: { stitches: roundedStitches, lengthCm: Math.max(8, derived.highCalfCircumference.value - derived.ankleCircumference.value) },
      heel: {
        stitches: heelStitches,
        lengthCm: heelFlapLengthCm,
        detail: construction.heelStyle === "gussetted"
          ? measurements.heelDiagonalCm === undefined
            ? `Gusset flap fallback: ${heelFlapStitches} sts, ${pickupsPerSide.toFixed(1)} pickups per side`
            : `Heel diagonal method: ${targetGussetStitches} sts at gusset, ${pickupsPerSide.toFixed(1)} pickups per side`
          : construction.heelStyle === "afterthought"
            ? "Afterthought heel: standard half-round shaping"
            : "Short-row heel: standard wedge shaping",
        heelFlapStitches,
        instepStitches,
        heelTurnStitches,
        targetGussetStitches,
        pickupStitches,
        pickupsPerSide,
      },
      foot: { stitches: roundedStitches, lengthCm: Math.max(0, measurements.footLengthCm - heelLengthCm - toeLengthCm) },
      toe: { finalStitches: toeFinalStitches, lengthCm: toeLengthCm, detail: construction.toeStyle === "round" ? "Round toe: decrease 4 stitches every second row" : "Star toe: decrease evenly to 8 stitches" },
    },
  };
}