import { NumberField } from "@/components/NumberField";
import type { DisplayUnit, Measurements } from "@/lib/domain";
import { fieldControlStyle } from "@/theme/styles";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { View } from "react-native";
import LabeledField from "../ui/LabeledField";

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
      <View>
        <LabeledField label="Display" required responsive>
          <Picker
            accessibilityLabel="Display"
            style={fieldControlStyle()}
            selectedValue={unit}
            onValueChange={(value) => setUnit(value as DisplayUnit)}
          >
            <Picker.Item key="metric" label="Metric" value="metric" />
            <Picker.Item key="imperial" label="Imperial" value="imperial" />
          </Picker>
        </LabeledField>
      </View>
      <View>
        {FIELDS.map(({ key, label, required }) => (
          <NumberField
            key={key}
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
        ))}
      </View>
    </>
  );
}
