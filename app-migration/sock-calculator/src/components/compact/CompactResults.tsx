import type { calculateStitches } from "@/lib/calculations";
import { formatMeasurement } from "@/lib/units";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    <View
      style={styles.compactResults}
      className="compact-results"
      accessibilityLabel="Results"
    >
      {errors.length > 0 && <Text style={styles.errorBox}>{errors[0]}</Text>}
      <Pressable style={styles.compactHero}>
        <Text style={styles.heroStrong}>{result.roundedStitches}</Text> sts cast
        on
        <Text style={styles.heroSmall}>
          {" "}
          for {formatMeasurement(result.easedCircumferenceCm, "metric")}
        </Text>
      </Pressable>
      <View style={styles.scrollResults}>
        {rows.map(([name, value]) => (
          <View key={name} style={styles.resultRow}>
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
    borderTopColor: "rgba(255, 255, 255, 0.15)", // #ffffff25 ≈ rgba(255,255,255, 0.15)
    paddingTop: 0.25, // 0.5rem = 8px
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
    marginTop: 14,
  },
  heroStrong: {
    fontSize: 24, // 1.6rem approx
    fontWeight: "700",
  },
  heroSmall: {
    color: "#bcb8af",
    fontSize: 8, // 0.8rem ≈ 12px for compact view
  },
  scrollResults: {
    paddingTop: 14,
  },
  resultRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    gap: 18,
    padding: 13,
  },
  resultName: {
    fontSize: 13,
  },
  resultValue: {
    color: "#f6b18d",
    whiteSpace: "nowrap",
  },
});
