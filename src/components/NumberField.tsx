import type { DisplayUnit } from "@/lib/domain";
import { fromCentimetres, measurementLabel, toCentimetres } from "@/lib/units";
import { palette } from "@/theme/colors";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? " *" : ""}
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={
          value === undefined
            ? ""
            : String(Number(fromCentimetres(value, unit).toFixed(2)))
        }
        onChangeText={(text) =>
          onChange(text === "" ? undefined : toCentimetres(Number(text), unit))
        }
      />
      <Text style={styles.fieldSmall}>{measurementLabel(unit)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    position: "relative",
    flexDirection: "column",
    gap: 7,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#77746b",
  },
  input: {
    width: "100%",
    backgroundColor: "#faf8f2",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
    color: "#24231f",
    minHeight: 44,
    paddingLeft: 12,
    paddingRight: 38,
  },
  fieldSmall: {
    position: "absolute",
    right: 12,
    bottom: 13,
    color: "#77746b",
    fontSize: 11,
  },
});
