import type { calculateStitches } from "@/lib/calculations";
import type { DisplayUnit } from "@/lib/domain";
import { formatMeasurement } from "@/lib/units";
import { sharedStyles } from "@/theme/styles";
import { Text, View } from "react-native";
import LabeledField from "./ui/LabeledField";

type CalculationResult = ReturnType<typeof calculateStitches>;

type Props = {
  result: CalculationResult;
  unit: DisplayUnit;
  validation: string[];
};

function ResultMetric({
  label,
  value,
  unit,
  source,
}: {
  label: string;
  value: number;
  unit: DisplayUnit;
  source?: "entered" | "calculated";
}) {
  return (
    <LabeledField label={label}>
      <Text>
        {formatMeasurement(value, unit)}{" "}
        {source === "calculated" && <Text>calculated</Text>}
      </Text>
    </LabeledField>
  );
}

function SectionRow({
  label,
  detail,
  stitches,
}: {
  label: string;
  detail: string;
  stitches: number;
}) {
  return (
    <View style={sharedStyles.row}>
      <View>
        <Text>{label}</Text>
        <Text>{detail}</Text>
      </View>
      <Text>{stitches} sts</Text>
    </View>
  );
}

export function ResultsPanel({ result, unit, validation }: Props) {
  const derived = result.derived;
  const { sections } = result;
  return (
    <View
      style={[sharedStyles.container, sharedStyles.bordered]}
      onLayout={(event) => {}}
    >
      <Text style={[sharedStyles.heading1, sharedStyles.leftAligned]}>
        Stitch plan
      </Text>

      {validation.length > 0 && (
        <Text style={sharedStyles.error}>{validation[0]}</Text>
      )}

      <View>
        <LabeledField label="Target foot circumference">
          <Text>{formatMeasurement(result.easedCircumferenceCm, unit)}</Text>
        </LabeledField>
        <Text>
          {result.easePercent}% negative ease applied to{" "}
          {formatMeasurement(result.targetCircumferenceCm, unit)}
        </Text>
      </View>

      <View>
        <LabeledField label="Base stitches">
          <Text>{result.baseStitches.toFixed(1)}</Text>
        </LabeledField>

        <LabeledField label="Rounded stitches">
          <Text>{result.roundedStitches}</Text>
        </LabeledField>
        <Text>repeat-constrained</Text>
      </View>

      <View>
        <ResultMetric
          label="Ankle"
          value={derived.ankleCircumference.value}
          unit={unit}
          source={derived.ankleCircumference.source}
        />
        <ResultMetric
          label="Heel height"
          value={derived.heelHeight.value}
          unit={unit}
          source={derived.heelHeight.source}
        />
        <ResultMetric
          label="Toe length"
          value={derived.toeLength.value}
          unit={unit}
          source={derived.toeLength.source}
        />
      </View>

      <View>
        <Text style={[sharedStyles.heading2, sharedStyles.leftAligned]}>
          Section counts
        </Text>
        <SectionRow
          label="Cuff"
          detail={sections.cuff.detail}
          stitches={sections.cuff.stitches}
        />
        <SectionRow
          label="Leg"
          detail={`${formatMeasurement(sections.leg.lengthCm, unit)} working length`}
          stitches={sections.leg.stitches}
        />
        <SectionRow
          label="Heel"
          detail={sections.heel.detail}
          stitches={sections.heel.stitches}
        />
        <SectionRow
          label="Foot"
          detail={`${formatMeasurement(sections.foot.lengthCm, unit)} working length`}
          stitches={sections.foot.stitches}
        />
        <SectionRow
          label="Toe"
          detail={sections.toe.detail}
          stitches={sections.toe.finalStitches}
        />
      </View>
    </View>
  );
}
