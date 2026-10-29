import { NumberField } from "@/components/NumberField";
import type { DisplayUnit, Measurements } from "@/lib/domain";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PlatformPicker } from "../ui/PlatformPicker";

type Props = {
  measurements: Measurements;
  onChange: (measurements: Measurements) => void;
};

type FieldDefinition = {
  key: keyof Measurements;
  label: string;
  required?: boolean;
};

const FIELDS: FieldDefinition[] = [
  { key: "footLengthCm", label: "Foot length", required: true },
  { key: "footCircumferenceCm", label: "Ball circumference", required: true },
  { key: "heelDiagonalCm", label: "Heel diagonal" },
  { key: "ankleCircumferenceCm", label: "Ankle circumference" },
  { key: "heelHeightCm", label: "Heel height" },
  { key: "instepCircumferenceCm", label: "Instep circumference" },
  { key: "toeLengthCm", label: "Toe length" },
  { key: "lowCalfCircumferenceCm", label: "Low calf circumference" },
  { key: "highCalfCircumferenceCm", label: "High calf circumference" },
];

export function FootSizeForm({ measurements, onChange }: Props) {
  const [unit, setUnit] = useState<DisplayUnit>("metric");

  return (
    <>
      <View style={styles.unitToggle}>
        <Text style={styles.unitToggleLabel}>Display</Text>
        <View style={styles.selectWrapper}>
          <PlatformPicker
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue as DisplayUnit)}
            items={[
              { label: "Metric", value: "metric" },
              { label: "Imperial", value: "imperial" },
            ]}
          >
            {/* <Picker.Item label="Metric" value="metric" />
            <Picker.Item label="Imperial" value="imperial" /> */}
          </PlatformPicker>
        </View>
      </View>
      <View style={styles.fieldGrid}>
        {FIELDS.map(({ key, label, required }) => (
          <View key={key} style={styles.fieldWrapper}>
            <NumberField
              label={label}
              required={required}
              unit={unit}
              value={measurements[key]}
              onChange={(value) =>
                onChange({
                  ...measurements,
                  [key]: required ? (value ?? 0) : value,
                })
              }
            />
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  unitToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  unitToggleLabel: {
    color: "#77746b",
    fontSize: 13,
  },
  selectWrapper: {
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    borderRadius: 2,
    overflow: "hidden",
    minWidth: 140,
  },
  select: {
    color: "#24231f",
    height: 44,
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  fieldWrapper: {
    width: "48%",
    minWidth: 200,
    flexGrow: 1,
  },
});
