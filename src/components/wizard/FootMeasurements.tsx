import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import {
  DEFAULT_RECORD,
  type DisplayUnit,
  type Measurements,
} from "@/lib/domain";
import { measurementLabel } from "@/lib/units";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Panel } from "../Panel/Panel";
import { PanelHeading } from "../Panel/PanelHeading";
import LabeledTextInput from "../ui/labeledTextInput";

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

      {/* <NumberField
        label="Foot length"
        value={measurements.footLengthCm}
        unit={unit}
        required
        onChange={(value) => onChange({ footLengthCm: value ?? 0 })}
      /> */}
      <LabeledTextInput
        label={`Foot length (${measurementLabel(unit)})`}
        value={measurements.footLengthCm?.toString() ?? ""}
        required
        onChangeText={function (value: string): void {
          onChange({
            ...measurements,
            footLengthCm: Number(value) ?? 0,
          });
        }}
      />
      <LabeledTextInput
        label={`Ball circumference (${measurementLabel(unit)})`}
        value={measurements.footCircumferenceCm?.toString() ?? ""}
        required
        onChangeText={(value) =>
          onChange({ footCircumferenceCm: Number(value) ?? 0 })
        }
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
          <LabeledTextInput
            label={`Heel diagonal (${measurementLabel(unit)})`}
            value={measurements.heelDiagonalCm?.toString() ?? ""}
            onChangeText={(value) =>
              onChange({ heelDiagonalCm: Number(value) ?? 0 })
            }
          />
          <LabeledTextInput
            label={`Ankle circumference (${measurementLabel(unit)})`}
            value={measurements.ankleCircumferenceCm?.toString() ?? ""}
            onChangeText={(value) =>
              onChange({ ankleCircumferenceCm: Number(value) ?? 0 })
            }
          />
          <LabeledTextInput
            label={`Heel height (${measurementLabel(unit)})`}
            value={measurements.heelHeightCm?.toString() ?? ""}
            onChangeText={(value) =>
              onChange({ heelHeightCm: Number(value) ?? 0 })
            }
          />
          <LabeledTextInput
            label={`Instep circumference (${measurementLabel(unit)})`}
            value={measurements.instepCircumferenceCm?.toString() ?? ""}
            onChangeText={(value) =>
              onChange({ instepCircumferenceCm: Number(value) ?? 0 })
            }
          />
          <LabeledTextInput
            label={`Toe length (${measurementLabel(unit)})`}
            value={measurements.toeLengthCm?.toString() ?? ""}
            onChangeText={(value) =>
              onChange({ toeLengthCm: Number(value) ?? 0 })
            }
          />
          <LabeledTextInput
            label={`Low calf circumference (${measurementLabel(unit)})`}
            value={measurements.lowCalfCircumferenceCm?.toString() ?? ""}
            onChangeText={(value) =>
              onChange({ lowCalfCircumferenceCm: Number(value) ?? 0 })
            }
          />
          <LabeledTextInput
            label={`High calf circumference (${measurementLabel(unit)})`}
            value={measurements.highCalfCircumferenceCm?.toString() ?? ""}
            onChangeText={(value) =>
              onChange({ highCalfCircumferenceCm: Number(value) ?? 0 })
            }
          />
        </View>
      )}
    </Panel>
  );
}
