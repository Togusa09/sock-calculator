import {
  RIBBING_REPEAT,
  type CalculatorRecord,
  type ConstructionCalculation,
  type CuffCalculation,
  type CuffStyle,
  type DerivedMeasurements,
  type FitResult,
  type HeelCalculation,
  type HeelStyle,
  type ToeCalculation,
  type ToeStyle,
} from "./domain";

export type CuffDefinition = {
  style: CuffStyle;
  calculate: (record: CalculatorRecord, fit: FitResult) => CuffCalculation;
};

export type HeelDefinition = {
  style: HeelStyle;
  calculate: (
    record: CalculatorRecord,
    fit: FitResult,
    derived: DerivedMeasurements,
  ) => HeelCalculation;
};

export type ToeDefinition = {
  style: ToeStyle;
  calculate: (
    record: CalculatorRecord,
    fit: FitResult,
    derived: DerivedMeasurements,
  ) => ToeCalculation;
};

const ribbedCuff: CuffDefinition = {
  style: "ribbed",
  calculate: (record, fit) => ({
    stitches: fit.roundedStitches,
    lengthCm: 5,
    detail: `${record.construction.ribbing} rib: 5 cm default`,
  }),
};

const foldedCuff: CuffDefinition = {
  style: "folded",
  calculate: (_record, fit) => ({
    stitches: fit.roundedStitches,
    lengthCm: 6,
    detail: "Folded cuff: 6 cm default",
  }),
};

const gussettedHeel: HeelDefinition = {
  style: "gussetted",
  calculate: (record, fit) => {
    const { measurements, tension } = record;

    // Width of heel flap in stitches
    const heelFlapStitches = Math.max(1, Math.round(fit.roundedStitches / 2));
    const instepStitches = fit.roundedStitches - heelFlapStitches;
    const heelTurnStitches = Math.round(heelFlapStitches / 2) + 2;

    const ease = 1 - fit.easePercent / 100;

    const heelDiagonalStitches =
      measurements.heelDiagonalCm === undefined
        ? fit.roundedStitches
        : Math.max(
            1,
            Math.round(
              (measurements.heelDiagonalCm * ease * tension.stitchesPer10Cm) /
                10,
            ),
          );

    const pickupStitches =
      measurements.heelDiagonalCm === undefined
        ? heelFlapStitches
        : Math.max(0, heelDiagonalStitches - heelTurnStitches - instepStitches);

    const pickupsPerSide = Math.round(pickupStitches / 2);
    const evenPickupStitches = pickupsPerSide * 2;

    const heelFlapLengthCm = (pickupsPerSide * 10) / tension.stitchesPer10Cm;
    const heelFlapRows = record.construction.heelFlapRows ?? evenPickupStitches;

    return {
      stitches: heelFlapStitches,
      lengthCm: heelFlapLengthCm,
      heelFlapRows,
      detail:
        measurements.heelDiagonalCm === undefined
          ? `Gusset flap fallback: ${heelFlapStitches} sts x ${heelFlapRows} rows, ${pickupsPerSide} pickups per side`
          : `Heel diagonal method: ${heelFlapStitches} sts x ${heelFlapRows} rows, ${pickupsPerSide} pickups per side, ${heelDiagonalStitches} sts at gusset, `,
      heelFlapStitches,
      instepStitches,
      heelTurnStitches,
      targetGussetStitches: heelDiagonalStitches,
      pickupStitches: evenPickupStitches,
      pickupsPerSide,
    };
  },
};

const afterthoughtHeel: HeelDefinition = {
  style: "afterthought",
  calculate: (_record, fit, derived) => ({
    stitches: fit.roundedStitches,
    lengthCm: derived.heelHeight.value,
    heelFlapRows: 0,
    detail: "Afterthought heel: standard half-round shaping",
    heelFlapStitches: 0,
    instepStitches: fit.roundedStitches,
    heelTurnStitches: 0,
    targetGussetStitches: fit.roundedStitches,
    pickupStitches: 0,
    pickupsPerSide: 0,
  }),
};

const shortRowHeel: HeelDefinition = {
  style: "short-row",
  calculate: (_record, fit, derived) => ({
    stitches: fit.roundedStitches,
    lengthCm: derived.heelHeight.value,
    heelFlapRows: 0,
    detail: "Short-row heel: standard wedge shaping",
    heelFlapStitches: 0,
    instepStitches: fit.roundedStitches,
    heelTurnStitches: 0,
    targetGussetStitches: fit.roundedStitches,
    pickupStitches: 0,
    pickupsPerSide: 0,
  }),
};

const roundToe: ToeDefinition = {
  style: "round",
  calculate: (record, fit, derived) => ({
    finalStitches: Math.max(8, Math.round(fit.roundedStitches / 3)),
    lengthCm: record.construction.toeLengthCm ?? derived.toeLength.value,
    detail: "Round toe: decrease 4 stitches every second row",
  }),
};

const starToe: ToeDefinition = {
  style: "star",
  calculate: (record, _fit, derived) => ({
    finalStitches: 8,
    lengthCm: record.construction.toeLengthCm ?? derived.toeLength.value,
    detail: "Star toe: decrease evenly to 8 stitches",
  }),
};

export const CUFF_DEFINITIONS: Record<CuffStyle, CuffDefinition> = {
  ribbed: ribbedCuff,
  folded: foldedCuff,
};

export const HEEL_DEFINITIONS: Record<HeelStyle, HeelDefinition> = {
  gussetted: gussettedHeel,
  afterthought: afterthoughtHeel,
  "short-row": shortRowHeel,
};

export const TOE_DEFINITIONS: Record<ToeStyle, ToeDefinition> = {
  round: roundToe,
  star: starToe,
};

export function calculateConstruction(
  record: CalculatorRecord,
  fit: FitResult,
  derived: DerivedMeasurements,
): ConstructionCalculation {
  const cuff = CUFF_DEFINITIONS[record.construction.cuffStyle].calculate(
    record,
    fit,
  );
  const heel = HEEL_DEFINITIONS[record.construction.heelStyle].calculate(
    record,
    fit,
    derived,
  );
  const toe = TOE_DEFINITIONS[record.construction.toeStyle].calculate(
    record,
    fit,
    derived,
  );

  return {
    cuff,
    leg: {
      stitches: fit.roundedStitches,
      lengthCm: Math.max(
        8,
        derived.highCalfCircumference.value - derived.ankleCircumference.value,
      ),
    },
    heel,
    foot: {
      stitches: fit.roundedStitches,
      lengthCm: Math.max(
        0,
        record.measurements.footLengthCm -
          derived.heelHeight.value -
          toe.lengthCm,
      ),
    },
    toe,
  };
}

export function roundStitchesToRibbing(
  stitches: number,
  ribbing: CalculatorRecord["construction"]["ribbing"],
): number {
  const repeat = RIBBING_REPEAT[ribbing];
  return Math.max(repeat, Math.round(stitches / repeat) * repeat);
}
