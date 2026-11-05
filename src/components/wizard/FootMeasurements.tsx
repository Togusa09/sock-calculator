import { NumberField } from "@/components/NumberField";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import {
  DEFAULT_RECORD,
  type DisplayUnit,
  type Measurements,
} from "@/lib/domain";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Panel } from "../Panel/Panel";
import { PanelHeading } from "../Panel/PanelHeading";

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

      <NumberField
        label="Foot length"
        value={measurements.footLengthCm}
        unit={unit}
        required
        onChange={(value) => onChange({ footLengthCm: value ?? 0 })}
      />
      <NumberField
        label="Ball circumference"
        value={measurements.footCircumferenceCm}
        unit={unit}
        required
        onChange={(value) => onChange({ footCircumferenceCm: value ?? 0 })}
      />

      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text>{isExpanded ? "▼ More measurements" : "▶ More measurements"}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View>
          <NumberField
            label="Heel diagonal"
            value={measurements.heelDiagonalCm}
            unit={unit}
            onChange={(value) => onChange({ heelDiagonalCm: value })}
          />
          <NumberField
            label="Ankle circumference"
            value={measurements.ankleCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ ankleCircumferenceCm: value })}
          />
          <NumberField
            label="Heel height"
            value={measurements.heelHeightCm}
            unit={unit}
            onChange={(value) => onChange({ heelHeightCm: value })}
          />
          <NumberField
            label="Instep circumference"
            value={measurements.instepCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ instepCircumferenceCm: value })}
          />
          <NumberField
            label="Toe length"
            value={measurements.toeLengthCm}
            unit={unit}
            onChange={(value) => onChange({ toeLengthCm: value })}
          />
          <NumberField
            label="Low calf circumference"
            value={measurements.lowCalfCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ lowCalfCircumferenceCm: value })}
          />
          <NumberField
            label="High calf circumference"
            value={measurements.highCalfCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ highCalfCircumferenceCm: value })}
          />
        </View>
      )}
    </Panel>
  );
}
