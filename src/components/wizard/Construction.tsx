import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import {
  CuffStyle,
  DEFAULT_RECORD,
  HeelStyle,
  Ribbing,
  ToeStyle,
  type ConstructionOptions,
} from "@/lib/domain";
import { useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import { Panel } from "../Panel/Panel";
import { PanelHeading } from "../Panel/PanelHeading";
import { PlatformPicker } from "../ui/PlatformPicker";

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
      <View testID="construction-fields">
        <View testID="construction-cuff-row">
          <View>
            <Text>Cuff</Text>
            <PlatformPicker
              flush
              selectedValue={construction.cuffStyle}
              onValueChange={(cuffStyle) =>
                onChange({ cuffStyle: cuffStyle as CuffStyle })
              }
              items={[
                { value: "ribbed", label: "Ribbed cuff" },
                { value: "folded", label: "Folded cuff" },
              ]}
            />
          </View>
          {construction.cuffStyle === "ribbed" && (
            <View testID="construction-ribbing-field">
              <Text>Ribbing repeat</Text>
              <PlatformPicker
                flush
                selectedValue={construction.ribbing}
                onValueChange={(ribbing) =>
                  onChange({ ribbing: ribbing as Ribbing })
                }
                items={[
                  { value: "1x1", label: "1x1" },
                  { value: "1x2", label: "1x2" },
                  { value: "2x2", label: "2x2" },
                  { value: "3x3", label: "3x3" },
                ]}
              />
            </View>
          )}
        </View>
        <View>
          <Text>Heel</Text>
          <PlatformPicker
            flush
            selectedValue={construction.heelStyle}
            onValueChange={(heelStyle) =>
              onChange({ heelStyle: heelStyle as HeelStyle })
            }
            items={[
              { value: "gussetted", label: "Gussetted" },
              { value: "afterthought", label: "Afterthought" },
              { value: "short-row", label: "Short-row" },
            ]}
          />
        </View>
        <View>
          <Text>Toe</Text>
          <PlatformPicker
            flush
            selectedValue={construction.toeStyle}
            onValueChange={(toeStyle) =>
              onChange({ toeStyle: toeStyle as ToeStyle })
            }
            items={[
              { value: "round", label: "Round" },
              { value: "star", label: "Star" },
            ]}
          />
        </View>
      </View>

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
          <Text>Project negative ease (%)</Text>
          <TextInput
            keyboardType="numeric"
            value={String(construction.negativeEasePercent)}
            onChangeText={(text) =>
              onChange({ negativeEasePercent: Number(text) })
            }
          />
        </View>
      )}
    </Panel>
  );
}
