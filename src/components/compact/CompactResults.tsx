import type { calculateStitches } from "@/lib/calculations";
import { formatMeasurement } from "@/lib/units";
import { sharedStyles } from "@/theme/styles";
import { Text, View } from "react-native";

type Props = {
  result: ReturnType<typeof calculateStitches>;
  errors: string[];
};

export function CompactResults({ result, errors }: Props) {
  const { sections } = result;
  const rows: [string, string][] = [
    ["Cuff", `${sections.cuff.stitches} sts`],
    ["Leg", `${sections.leg.stitches} sts`],
    ["Heel", `${sections.heel.stitches} sts`],
    ["Foot", `${sections.foot.stitches} sts`],
    ["Toe", `${sections.toe.finalStitches} sts`],
  ];

  return (
    <View accessibilityLabel="Results">
      {errors.length > 0 && <Text accessibilityRole="alert">{errors[0]}</Text>}
      <Text>
        {result.roundedStitches} sts cast on for{" "}
        {formatMeasurement(result.easedCircumferenceCm, "metric")}
      </Text>
      {rows.map(([name, value]) => (
        <View key={name} style={sharedStyles.row}>
          <Text>{name}: </Text>
          <Text>{value}</Text>
        </View>
      ))}
    </View>
  );
}
