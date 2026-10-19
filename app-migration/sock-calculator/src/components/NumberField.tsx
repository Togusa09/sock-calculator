import { palette } from "@/theme/colors";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { DisplayUnit } from "../lib/domain";
import { fromCentimetres, measurementLabel, toCentimetres } from "../lib/units";

type Props = {
  label: string;
  value: number | undefined;
  unit: DisplayUnit;
  onChange: (value: number | undefined) => void;
  required?: boolean;
};

export function NumberField({
  label,
  value,
  unit,
  onChange,
  required = false,
}: Props) {
  const displayValue =
    value === undefined ? "" : Number(fromCentimetres(value, unit).toFixed(2));

  return (
    <View
      style={styles.field}
      testID={`number-field-${label.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <Text style={styles.label}>
        {label}
        {required ? " *" : ""}
      </Text>
      <TextInput
        style={[styles.input, required && styles.requiredInput]}
        keyboardType="decimal-pad"
        placeholder={`0 ${measurementLabel(unit)}`}
        value={String(displayValue)}
        onChangeText={(text) => {
          const numericValue = text === "" ? undefined : Number(text);
          onChange(
            numericValue === NaN
              ? undefined
              : toCentimetres(numericValue, unit),
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: palette.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: palette.panel,
  },
  requiredInput: {
    borderWidth: 2,
    borderColor: palette.textPrimary,
  },
  unitLabel: {
    fontSize: 12,
    color: palette.hintText,
    marginLeft: 4,
  },
});
