import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import { DEFAULT_RECORD, type ConstructionOptions } from "@/lib/domain";
import { palette } from "@/theme/colors";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
    <View style={styles.panel} className="panel">
      <View style={styles.sectionHeading} className="section-heading">
        <View
          style={styles.sectionHeadingMain}
          className="section-heading-main"
        >
          <Text style={[styles.step, { color: palette.orange }]}>04</Text>
          <View>
            <Text style={styles.headingTitle}>
              Construction
              {loadedItem && (
                <Text style={styles.loadedItemName}>
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </Text>
              )}
            </Text>
            <Text style={styles.sectionSubtitle}>
              Choose the shape you plan to knit.
            </Text>
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

      <ScrollView contentContainerStyle={styles.fieldsContainer}>
        {/* Cuff and Ribbing */}
        <View style={styles.rowContainer}>
          <TextInput
            placeholder="Cuff"
            editable={false}
            style={styles.fieldLabel}
          />

          <Pressable onPress={() => {}}>
            <Text
              style={[
                styles.select,
                construction.cuffStyle === "ribbed" && styles.selectActive,
              ]}
            >
              {construction.cuffStyle === "ribbed"
                ? "Ribbed cuff"
                : "Folded cuff"}
            </Text>
          </Pressable>

          {construction.cuffStyle === "ribbed" && (
            <>
              <Text style={styles.fieldLabel}>Ribbing repeat</Text>
              <Pressable onPress={() => {}}>
                <Text style={[styles.select, styles.conditionalSelect]}>
                  {["1x1", "1x2", "2x2", "3x3"][
                    Math.max(0, construction.ribbing - 1)
                  ] || "1x1"}
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Heel */}
        <View style={styles.rowContainer}>
          <Text style={styles.fieldLabel}>Heel</Text>
          <Pressable onPress={() => {}}>
            <Text style={[styles.select, styles.conditionalSelect]}>
              {construction.heelStyle === "gussetted"
                ? "Gussetted"
                : construction.heelStyle === "afterthought"
                  ? "Afterthought"
                  : "Short-row"}
            </Text>
          </Pressable>
        </View>

        {/* Toe */}
        <View style={styles.rowContainer}>
          <Text style={styles.fieldLabel}>Toe</Text>
          <Pressable onPress={() => {}}>
            <Text style={[styles.select, styles.conditionalSelect]}>
              {construction.toeStyle === "round" ? "Round" : "Star"}
            </Text>
          </Pressable>
        </View>

        {/* Override checkbox */}
        <Pressable
          onPress={() => onChange({ negativeEasePercent: tensionNegativeEase })}
          style={styles.override}
          className="override"
        >
          <Text style={styles.overrideText}>Override project ease</Text>
          {construction.negativeEasePercent !== undefined && (
            <TextInput
              style={styles.percentageInput}
              value={`${construction.negativeEasePercent}%`}
              editable={false}
            />
          )}
        </Pressable>

        {/* Negative ease input */}
        {construction.negativeEasePercent !== undefined && (
          <TextInput
            style={[styles.compactInput, styles.percentageCompact]}
            placeholder="Project negative ease"
            keyboardType="numeric"
            value={String(construction.negativeEasePercent)}
            onChangeText={(value) =>
              onChange({ negativeEasePercent: Number(value) })
            }
            // placeholderTextColor=palette.muted
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 27,
  },
  sectionHeading: {
    marginBottom: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 15,
  },
  sectionHeadingMain: {
    flex: 1,
  },
  step: {
    fontFamily: "monospace",
    fontSize: 14,
    color: palette.orange,
    paddingTop: 8,
  },
  headingTitle: {},
  loadedItemName: {
    fontWeight: "400",
    fontSize: 13,
    color: palette.muted,
  },
  sectionSubtitle: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: 0,
  },
  fieldsContainer: {},
  rowContainer: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 16,
  },
  fieldLabel: {
    flex: 1,
    fontSize: 12,
    color: palette.muted,
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
  override: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  overrideText: {
    fontSize: 13,
    color: palette.muted,
  },
  percentageInput: {
    width: 80,
    fontWeight: "600",
    fontSize: 13,
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
