import type { calculateStitches } from "@/lib/calculations";
import type { DisplayUnit } from "@/lib/domain";
import { formatMeasurement } from "@/lib/units";
import { StyleSheet, Text, View } from "react-native";

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
    <View style={styles.metric}>
      <Text style={styles.metricSpan}>{label}</Text>
      <Text style={styles.metricStrong}>{formatMeasurement(value, unit)}</Text>
      {source === "calculated" && (
        <Text style={styles.metricEm}>calculated</Text>
      )}
    </View>
  );
}

export function ResultsPanel({ result, unit, validation }: Props) {
  const derived = result.derived;
  return (
    <View style={styles.resultsColumn}>
      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.eyebrow}>YOUR WORKING NUMBERS</Text>
          <Text style={styles.h2}>Stitch plan</Text>
        </View>
        <View style={styles.liveDotContainer}>
          <Text style={styles.liveDotText}>Live</Text>
        </View>
      </View>

      {validation.length > 0 && (
        <View style={styles.errorBox}>
          <Text style={styles.errorBoxText}>{validation[0]}</Text>
        </View>
      )}

      <View style={styles.heroResult}>
        <Text style={styles.heroSpan}>Target foot circumference</Text>
        <Text style={styles.heroStrong}>
          {formatMeasurement(result.easedCircumferenceCm, unit)}
        </Text>
        <Text style={styles.heroSmall}>
          {result.easePercent}% negative ease applied to{" "}
          {formatMeasurement(result.targetCircumferenceCm, unit)}
        </Text>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricSpan}>Base stitches</Text>
          <Text style={styles.metricStitchesStrong}>
            {result.baseStitches.toFixed(1)}
          </Text>
        </View>
        <View style={[styles.metric, styles.metricAccent]}>
          <Text style={styles.metricSpan}>Rounded stitches</Text>
          <Text style={[styles.metricStitchesStrong, styles.accentText]}>
            {result.roundedStitches}
          </Text>
          <Text style={styles.metricSmall}>repeat-constrained</Text>
        </View>
      </View>

      <View style={styles.derivedList}>
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

      <View style={styles.sectionResults}>
        <Text style={styles.sectionTitle}>Section counts</Text>

        <View style={styles.resultRow}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowText}>Cuff</Text>
            <Text style={styles.rowSmall}>{result.sections.cuff.detail}</Text>
          </View>
          <Text style={styles.rowStrong}>
            {result.sections.cuff.stitches} sts
          </Text>
        </View>

        <View style={styles.resultRow}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowText}>Leg</Text>
            <Text style={styles.rowSmall}>
              {formatMeasurement(result.sections.leg.lengthCm, unit)} working
              length
            </Text>
          </View>
          <Text style={styles.rowStrong}>
            {result.sections.leg.stitches} sts
          </Text>
        </View>

        <View style={styles.resultRow}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowText}>Heel</Text>
            <Text style={styles.rowSmall}>{result.sections.heel.detail}</Text>
          </View>
          <Text style={styles.rowStrong}>
            {result.sections.heel.stitches} sts
          </Text>
        </View>

        <View style={styles.resultRow}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowText}>Foot</Text>
            <Text style={styles.rowSmall}>
              {formatMeasurement(result.sections.foot.lengthCm, unit)} working
              length
            </Text>
          </View>
          <Text style={styles.rowStrong}>
            {result.sections.foot.stitches} sts
          </Text>
        </View>

        <View style={styles.resultRow}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowText}>Toe</Text>
            <Text style={styles.rowSmall}>{result.sections.toe.detail}</Text>
          </View>
          <Text style={styles.rowStrong}>
            {result.sections.toe.finalStitches} sts
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsColumn: {
    backgroundColor: "#24231f",
    padding: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#dd8a68",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  h2: {
    color: "#f7f2e9",
    fontSize: 28,
    fontWeight: "400",
    marginBottom: 24,
  },
  liveDotContainer: {
    backgroundColor: "#d7e7db",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  liveDotText: {
    color: "#61766b",
    fontSize: 11,
  },
  errorBox: {
    backgroundColor: "#f6d9ce",
    padding: 10,
    marginBottom: 15,
  },
  errorBoxText: {
    color: "#7d3320",
    fontSize: 12,
  },
  heroResult: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 20,
  },
  heroSpan: {
    color: "#bcb8af",
    fontSize: 12,
  },
  heroStrong: {
    color: "#f6b18d",
    fontSize: 42,
    marginVertical: 7,
  },
  heroSmall: {
    color: "#bcb8af",
    fontSize: 11,
  },
  metricGrid: {
    flexDirection: "row",
    gap: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 20,
  },
  metric: {
    flex: 1,
    backgroundColor: "#24231f",
    padding: 14,
  },
  metricAccent: {
    backgroundColor: "#24231f",
  },
  metricSpan: {
    color: "#bcb8af",
    fontSize: 12,
  },
  metricStrong: {
    color: "#f7f2e9",
    fontSize: 17,
    marginTop: 8,
  },
  metricStitchesStrong: {
    color: "#f7f2e9",
    fontSize: 24,
    marginTop: 8,
  },
  accentText: {
    color: "#f6b18d",
  },
  metricEm: {
    color: "#d7e7db",
    fontSize: 10,
    fontStyle: "normal",
    marginTop: 5,
  },
  metricSmall: {
    color: "#bcb8af",
    fontSize: 11,
    marginTop: 4,
  },
  derivedList: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingBottom: 18,
  },
  sectionResults: {
    paddingTop: 20,
  },
  sectionTitle: {
    color: "#bcb8af",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 15,
  },
  resultRow: {
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  rowText: {
    color: "#f7f2e9",
    fontSize: 13,
  },
  rowSmall: {
    color: "#9e9a91",
    fontSize: 10,
    marginTop: 4,
  },
  rowStrong: {
    color: "#f6b18d",
    fontSize: 14,
    fontWeight: "600",
  },
});
