import { palette } from "@/theme/colors";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { DisplayUnit, Measurements } from "../lib/domain";
import { NumberField } from "./NumberField";
import type { LoadedItemInfo } from "./SavedItemsControl";

type Props = {
  measurements: Measurements;
  unit: DisplayUnit;
  onChange: (update: Partial<Measurements>) => void;
};

export function FootMeasurements({ measurements, unit, onChange }: Props) {
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);

  const handleLoadSaved = async () => {
    // Placeholder for saved items loading logic
    Alert.alert("Saved Items", "Loading feature not yet implemented");
  };

  return (
    <View style={styles.panel} testID="foot-measurements">
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>01</Text>
            <Text style={styles.sectionTitle}>
              Foot measurements
              {loadedItem && (
                <Text style={styles.loadedItemName}>
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </Text>
              )}
            </Text>
            <Text style={styles.sectionSubtitle}>
              Two measurements are enough to begin.
            </Text>
          </View>
        </View>

        <Pressable onPress={handleLoadSaved} style={styles.skeletonContainer}>
          <View style={styles.skeleton} testID="saved-items-skeleton" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.fieldGridContent}>
        {[
          "footLengthCm",
          "footCircumferenceCm",
          "heelDiagonalCm",
          "ankleCircumferenceCm",
          "heelHeightCm",
          "instepCircumferenceCm",
          "toeLengthCm",
          "lowCalfCircumferenceCm",
          "highCalfCircumferenceCm",
        ].map((field) => {
          const labelMap: Record<string, string> = {
            footLengthCm: "Foot length",
            footCircumferenceCm: "Ball circumference",
            heelDiagonalCm: "Heel diagonal",
            ankleCircumferenceCm: "Ankle circumference",
            heelHeightCm: "Heel height",
            instepCircumferenceCm: "Instep circumference",
            toeLengthCm: "Toe length",
            lowCalfCircumferenceCm: "Low calf circumference",
            highCalfCircumferenceCm: "High calf circumference",
          };

          const valueMap: Record<string, number | undefined> = {
            footLengthCm: measurements.footLengthCm,
            footCircumferenceCm: measurements.footCircumferenceCm,
            heelDiagonalCm: measurements.heelDiagonalCm,
            ankleCircumferenceCm: measurements.ankleCircumferenceCm,
            heelHeightCm: measurements.heelHeightCm,
            instepCircumferenceCm: measurements.instepCircumferenceCm,
            toeLengthCm: measurements.toeLengthCm,
            lowCalfCircumferenceCm: measurements.lowCalfCircumferenceCm,
            highCalfCircumferenceCm: measurements.highCalfCircumferenceCm,
          };

          const label = labelMap[field];
          const value = valueMap[field];

          return (
            <NumberField
              key={field}
              label={label}
              value={value ?? 0}
              unit={unit}
              required={["footLengthCm", "footCircumferenceCm"].includes(field)}
              onChange={(newValue) =>
                onChange({ [field]: newValue ?? 0 }) as Partial<Measurements>
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.panelBg,
    paddingVertical: 16,
  },
  sectionHeading: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: palette.panel,
    borderBottomWidth: 1,
    borderBottomColor: palette.headingBorder,
  },
  sectionHeadingMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepNumber: {
    backgroundColor: palette.border,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    fontWeight: "700",
    color: palette.textPrimary,
    width: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  loadedItemName: {
    fontSize: 14,
    color: palette.textPrimary,
    fontStyle: "italic",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: palette.hintText,
    marginTop: 4,
  },
  skeletonContainer: {
    flex: 0,
    marginLeft: "auto",
  },
  skeleton: {
    width: 80,
    height: 32,
    backgroundColor: palette.skeletonBackground,
    borderRadius: 4,
  },
  fieldGridContent: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
});
