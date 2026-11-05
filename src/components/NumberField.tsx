import type { DisplayUnit } from "@/lib/domain";
import { fromCentimetres, measurementLabel, toCentimetres } from "@/lib/units";
import { Text, TextInput, View } from "react-native";

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
    <View>
      <Text>
        {label}
        {required ? " *" : ""} ({measurementLabel(unit)})
      </Text>
      <TextInput
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
    </View>
  );
}
