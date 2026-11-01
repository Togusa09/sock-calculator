import type { calculateStitches } from "@/lib/calculations";
import { formatMeasurement } from "@/lib/units";
import { StyleSheet, Text, View } from "react-native";

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
    <View style={styles.compactResults} accessibilityLabel="Results">
      {errors.length > 0 && (
        <Text style={styles.errorBox} accessibilityRole="alert">
          {errors[0]}
        </Text>
      )}
      <Text style={styles.compactHero}>
        <Text style={styles.heroStrong}>{result.roundedStitches}</Text> sts cast
        on
        <Text style={styles.heroSmall}>
          {" "}
          for {formatMeasurement(result.easedCircumferenceCm, "metric")}
        </Text>
      </Text>
      <View style={styles.resultsGrid}>
        {rows.map(([name, value]) => (
          <View key={name} style={styles.resultItem}>
            <Text style={styles.resultName}>{name}</Text>
            <Text style={styles.resultValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactResults: {
    borderTopWidth: 1,
    borderTopColor: "#ddd8ca",
    paddingTop: 8,
    marginTop: 14,
  },
  errorBox: {
    backgroundColor: "#f6d9ce",
    color: "#7d3320",
    fontSize: 12,
    padding: 10,
    marginBottom: 15,
  },
  compactHero: {
    marginBottom: 4,
    color: "#24231f",
    fontSize: 13,
  },
  heroStrong: {
    fontSize: 26,
    fontWeight: "700",
  },
  heroSmall: {
    color: "#77746b",
    fontSize: 12,
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  resultItem: {
    flex: 1,
    minWidth: 56,
    gap: 4,
    paddingVertical: 8,
  },
  resultName: {
    fontSize: 13,
    color: "#77746b",
  },
  resultValue: {
    color: "#24231f",
    fontWeight: "600",
  },
});
