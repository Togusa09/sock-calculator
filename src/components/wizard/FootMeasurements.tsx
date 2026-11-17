import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import {
  DEFAULT_RECORD,
  type DisplayUnit,
  type Measurements,
} from "@/lib/domain";
import { fieldControlStyle } from "@/theme/styles";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Panel } from "../Panel/Panel";
import { PanelHeading } from "../Panel/PanelHeading";
import LabeledUnitField from "../ui/LabeledUnitField";

type MeasurementInputProps = {
  label: string;
  unit: DisplayUnit;
  value: number | undefined;
  required?: boolean;
  onChange: (value: number) => void;
};

function MeasurementInput({
  label,
  unit,
  value,
  required,
  onChange,
}: MeasurementInputProps) {
  return (
    <LabeledUnitField label={label} unit={unit} required={required} responsive>
      <TextInput
        style={[fieldControlStyle(), styles.measurementControl]}
        accessibilityLabel={label}
        aria-required={required}
        value={value?.toString() ?? ""}
        onChangeText={(text) => onChange(Number(text) ?? 0)}
      />
    </LabeledUnitField>
  );
}

const styles = StyleSheet.create({
  measurementControl: {
    minWidth: 0,
    maxWidth: "100%",
    flexBasis: 220,
    flexGrow: 1,
  },
});
type Props = {
  measurements: Measurements;
  unit: DisplayUnit;
  onChange: (update: Partial<Measurements>) => void;
};

export function FootMeasurements({ measurements, unit, onChange }: Props) {
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Panel>
      <PanelHeading
        step={1}
        heading="Foot measurements"
        prompt="Two measurements are enough to begin."
        loadedItem={loadedItem}
      >
        <SavedItemsControl
          type="measurements"
          data={measurements}
          defaultData={DEFAULT_RECORD.measurements}
          onLoad={onChange}
          onLoadedItemChange={setLoadedItem}
        />
      </PanelHeading>

      <MeasurementInput
        label="Foot length"
        unit={unit}
        value={measurements.footLengthCm}
        required
        onChange={(cm) => onChange({ footLengthCm: cm })}
      />
      <MeasurementInput
        label="Ball circumference"
        unit={unit}
        value={measurements.footCircumferenceCm}
        required
        onChange={(cm) => onChange({ footCircumferenceCm: cm })}
      />

      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text>
          {isExpanded ? "▼ More measurements" : "▶ More measurements"}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View>
          <MeasurementInput
            label="Heel diagonal"
            unit={unit}
            value={measurements.heelDiagonalCm}
            onChange={(cm) => onChange({ heelDiagonalCm: cm })}
          />
          <MeasurementInput
            label="Ankle circumference"
            unit={unit}
            value={measurements.ankleCircumferenceCm}
            onChange={(cm) => onChange({ ankleCircumferenceCm: cm })}
          />
          <MeasurementInput
            label="Heel height"
            unit={unit}
            value={measurements.heelHeightCm}
            onChange={(cm) => onChange({ heelHeightCm: cm })}
          />
          <MeasurementInput
            label="Instep circumference"
            unit={unit}
            value={measurements.instepCircumferenceCm}
            onChange={(cm) => onChange({ instepCircumferenceCm: cm })}
          />
          <MeasurementInput
            label="Toe length"
            unit={unit}
            value={measurements.toeLengthCm}
            onChange={(cm) => onChange({ toeLengthCm: cm })}
          />
          <MeasurementInput
            label="Low calf circumference"
            unit={unit}
            value={measurements.lowCalfCircumferenceCm}
            onChange={(cm) => onChange({ lowCalfCircumferenceCm: cm })}
          />
          <MeasurementInput
            label="High calf circumference"
            unit={unit}
            value={measurements.highCalfCircumferenceCm}
            onChange={(cm) => onChange({ highCalfCircumferenceCm: cm })}
          />
        </View>
      )}
    </Panel>
  );
}
