import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import { DEFAULT_RECORD, type ConstructionOptions } from "@/lib/domain";
import { useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

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
    <View style={styles.panel}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.step}>04</Text>
          <View style={styles.headingContent}>
            <Text style={styles.h2}>
              Construction
              {loadedItem && (
                <Text style={styles.loadedItemName}>
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </Text>
              )}
            </Text>
            <Text style={styles.p}>Choose the shape you plan to knit.</Text>
          </View>
        </View>
        <SavedItemsControl
          type="construction"
          data={construction}
          defaultData={DEFAULT_RECORD.construction}
          onLoad={onChange}
          onLoadedItemChange={setLoadedItem}
        />
      </View>
      <View style={styles.override}>
        <Switch
          value={construction.negativeEasePercent !== undefined}
          onValueChange={(checked) =>
            onChange({
              negativeEasePercent: checked ? tensionNegativeEase : undefined,
            })
          }
        />
        <Text style={styles.overrideText}>Override project ease</Text>
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    padding: 27,
    borderRadius: 2,
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  sectionHeadingMain: {
    flexDirection: "row",
    gap: 15,
    flex: 1,
  },
  headingContent: {
    flex: 1,
  },
  step: {
    color: "#c75b36",
    fontSize: 14,
    fontFamily: "monospace",
    paddingTop: 8,
  },
  h2: {
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "400",
    color: "#24231f",
    marginBottom: 6,
  },
  loadedItemName: {
    color: "#77746b",
    fontWeight: "400",
    fontSize: 11,
  },
  p: {
    color: "#77746b",
    fontSize: 13,
    lineHeight: 18,
  },
  override: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 22,
  },
  overrideText: {
    color: "#77746b",
    fontSize: 13,
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
    fontSize: 12,
    color: "#77746b",
  },
  input: {
    backgroundColor: "#faf8f2",
    borderWidth: 1,
    borderColor: "#ddd8ca",
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
});
