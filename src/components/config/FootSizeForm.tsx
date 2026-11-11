import { NumberField } from "@/components/NumberField";
import type { DisplayUnit, Measurements } from "@/lib/domain";
import { useState } from "react";
import { Text, View } from "react-native";
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
      <View>
        <Text>Display</Text>
        <PlatformPicker
          selectedValue={unit}
          onValueChange={(itemValue) => setUnit(itemValue as DisplayUnit)}
          items={[
            { label: "Metric", value: "metric" },
            { label: "Imperial", value: "imperial" },
          ]}
        />
      </View>
      <View>
        {/* <LabeledTextInput label={""} value={""} onChange={function (value: string): void {
          
        } } /> */}
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
