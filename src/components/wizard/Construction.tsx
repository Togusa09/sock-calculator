import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import LabeledField from "@/components/ui/LabeledField";
import {
  CuffStyle,
  DEFAULT_RECORD,
  HeelStyle,
  Ribbing,
  ToeStyle,
  type ConstructionOptions,
} from "@/lib/domain";
import { fieldControlStyle } from "@/theme/styles";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import { Panel } from "../Panel/Panel";
import { PanelHeading } from "../Panel/PanelHeading";

type Props = {
  construction: ConstructionOptions;
  tensionNegativeEase: number;
  onChange: (update: Partial<ConstructionOptions>) => void;
};

export function Construction({
  construction,
  tensionNegativeEase,
  onChange,
}: Props) {
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);

  return (
    <Panel>
      <PanelHeading
        step={4}
        heading="Construction"
        prompt="Choose the shape you plan to knit."
        loadedItem={loadedItem}
      >
        <SavedItemsControl
          type="construction"
          data={construction}
          defaultData={DEFAULT_RECORD.construction}
          onLoad={onChange}
          onLoadedItemChange={setLoadedItem}
        />
      </PanelHeading>
      <LabeledField label="Cuff style" required responsive>
        <Picker
          style={fieldControlStyle()}
          selectedValue={construction.cuffStyle}
          onValueChange={(cuffStyle) =>
            onChange({ cuffStyle: cuffStyle as CuffStyle })
          }
        >
          <Picker.Item label="Ribbed cuff" value="ribbed" />
          <Picker.Item label="Folded cuff" value="folded" />
        </Picker>
      </LabeledField>

      {construction.cuffStyle === "ribbed" && (
        <View testID="construction-ribbing-field">
          <LabeledField
            label="Ribbing repeat"
            required
            responsive
            testID="construction-ribbing-repeat-field"
          >
            <Picker
              selectedValue={construction.ribbing}
              style={fieldControlStyle()}
              onValueChange={(ribbing) =>
                onChange({ ribbing: ribbing as Ribbing })
              }
            >
              <Picker.Item label="1x1" value="1x1" />
              <Picker.Item label="1x2" value="1x2" />
              <Picker.Item label="2x2" value="2x2" />
              <Picker.Item label="3x3" value="3x3" />
            </Picker>
          </LabeledField>
        </View>
      )}

      <LabeledField
        label="Heel style"
        required
        responsive
        testID="construction-heel-style-field"
      >
        <Picker
          style={fieldControlStyle()}
          selectedValue={construction.heelStyle}
          onValueChange={(heelStyle) =>
            onChange({ heelStyle: heelStyle as HeelStyle })
          }
        >
          <Picker.Item label="Gussetted" value="gussetted" />
          <Picker.Item label="Afterthought" value="afterthought" />
          <Picker.Item label="Short-row" value="short-row" />
        </Picker>
      </LabeledField>

      <LabeledField
        label="Toe style"
        required
        responsive
        testID="construction-toe-style-field"
      >
        <Picker
          style={fieldControlStyle()}
          selectedValue={construction.toeStyle}
          onValueChange={(toeStyle) =>
            onChange({ toeStyle: toeStyle as ToeStyle })
          }
        >
          <Picker.Item label="Round" value="round" />
          <Picker.Item label="Star" value="star" />
        </Picker>
      </LabeledField>

      <View style={{ flexDirection: "row" }}>
        <Switch
          accessibilityLabel="Override project ease"
          value={construction.negativeEasePercent !== undefined}
          onValueChange={(checked) =>
            onChange({
              negativeEasePercent: checked ? tensionNegativeEase : undefined,
            })
          }
        />
        <Text>Override project ease</Text>
      </View>

      {construction.negativeEasePercent !== undefined && (
        <View>
          <LabeledField label="Project negative ease (%)" responsive>
            <TextInput
              style={fieldControlStyle()}
              keyboardType="numeric"
              value={String(construction.negativeEasePercent)}
              onChangeText={(text) =>
                onChange({ negativeEasePercent: Number(text) })
              }
            />
          </LabeledField>
        </View>
      )}
    </Panel>
  );
}
