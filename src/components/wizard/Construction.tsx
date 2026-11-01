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
import { palette } from "@/theme/colors";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
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
      <ScrollView contentContainerStyle={styles.fieldsContainer}>
        {/* Cuff and Ribbing */}
        <View style={styles.rowContainer}>
          <Text style={styles.fieldLabel}>Cuff</Text>
          <PlatformPicker
            selectedValue={construction.cuffStyle}
            onValueChange={(cuffStyle) =>
              onChange({ cuffStyle: cuffStyle as CuffStyle })
            }
            items={[
              { value: "ribbed", label: "Ribbed Cuff" },
              { value: "folded", label: "Folded Cuff" },
            ]}
          >
            {/* <Picker.Item value="ribbed" label="Ribbed Cuff" />
            <Picker.Item value="folded" label="Folded cuff" /> */}
          </PlatformPicker>

          {construction.cuffStyle === "ribbed" && (
            <>
              <Text style={styles.fieldLabel}>Ribbing repeat</Text>

              <PlatformPicker
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
              >
                {/* <Picker.Item value="1x1" label="1x1"></Picker.Item>
                <Picker.Item value="1x2" label="1x2"></Picker.Item>
                <Picker.Item value="2x2" label="2x2"></Picker.Item>
                <Picker.Item value="3x3" label="3x3"></Picker.Item> */}
              </PlatformPicker>
            </>
          )}
        </View>

        {/* Heel */}
        <View style={styles.rowContainer}>
          <Text style={styles.fieldLabel}>Heel</Text>
          <PlatformPicker
            selectedValue={construction.heelStyle}
            onValueChange={(heelStyle) =>
              onChange({ heelStyle: heelStyle as HeelStyle })
            }
            items={[
              { value: "gussetted", label: "Gussetted" },
              { value: "afterthought", label: "Afterthought" },
              { value: "short-row", label: "Short-row" },
            ]}
          >
            {/* <Picker.Item value="gussetted" label="Gussetted" />
            <Picker.Item value="afterthought" label="Afterthought" />
            <Picker.Item value="short-row" label="Short-row" /> */}
          </PlatformPicker>
        </View>

        {/* Toe */}
        <View style={styles.rowContainer}>
          <Text style={styles.fieldLabel}>Toe</Text>
          <PlatformPicker
            selectedValue={construction.toeStyle}
            onValueChange={(toeStyle) =>
              onChange({ toeStyle: toeStyle as ToeStyle })
            }
            items={[
              { value: "round", label: "Round" },
              { value: "star", label: "Star" },
            ]}
          >
            {/* <Picker.Item value="round" label="Round" />
            <Picker.Item value="star" label="Star" /> */}
          </PlatformPicker>
        </View>

        {/* Override checkbox */}

        <View style={styles.override}>
          <Switch
            accessibilityLabel="Override project ease"
            value={construction.negativeEasePercent !== undefined}
            onValueChange={(checked) =>
              onChange({
                negativeEasePercent: checked ? tensionNegativeEase : undefined,
              })
            }
          />
          <Text style={styles.overrideText}>Override project ease</Text>
        </View>

        {/* Negative ease input */}
        {construction.negativeEasePercent !== undefined && (
          <View style={[styles.field, styles.compact]}>
            <Text style={styles.fieldLabel}>Project negative ease</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(construction.negativeEasePercent)}
              onChangeText={(text) =>
                onChange({ negativeEasePercent: Number(text) })
              }
            />
            <Text style={styles.fieldSmall}>%</Text>
          </View>
        )}
      </ScrollView>
    </Panel>
  );
}

const styles = StyleSheet.create({
  override: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 22,
  },
  compact: {
    maxWidth: 210,
    marginTop: 18,
  },
  field: {
    position: "relative",
    gap: 7,
  },
  fieldLabel: {
    flex: Platform.OS === "web" ? 1 : 0,
    fontSize: 12,
    color: palette.muted,
  },
  input: {
    backgroundColor: "#faf8f2",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
    color: "#24231f",
    minHeight: 44,
    paddingHorizontal: 12,
  },
  fieldSmall: {
    position: "absolute",
    right: 12,
    bottom: 13,
    color: "#77746b",
    fontSize: 11,
  },
  headingTitle: {},
  sectionSubtitle: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: 0,
  },
  fieldsContainer: {},
  rowContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: Platform.OS === "web" ? 18 : 4,
    marginBottom: 16,
  },
  select: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
    padding: 10,
    backgroundColor: palette.inputBackground,
    fontSize: 13,
    color: palette.textPrimary,
    flex: 1,
  },
  selectActive: {},
  conditionalSelect: {
    minHeight: 44,
  },
  overrideText: {
    fontSize: 13,
    color: palette.muted,
  },
  compactInput: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
    backgroundColor: palette.inputBackground,
    fontSize: 13,
    color: palette.textPrimary,
    minHeight: 44,
  },
});
