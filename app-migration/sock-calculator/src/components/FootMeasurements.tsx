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
import { palette } from "@/theme/colors";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Panel } from "./ui/Panel";

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
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.step}>01</Text>
          <View style={styles.headingContent}>
            <Text style={styles.h2}>
              Foot measurements
              {loadedItem && (
                <Text style={styles.loadedItemName}>
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </Text>
              )}
            </Text>
            <Text style={styles.p}>Two measurements are enough to begin.</Text>
          </View>
        </View>
        <SavedItemsControl
          type="measurements"
          data={measurements}
          defaultData={DEFAULT_RECORD.measurements}
          onLoad={onChange}
          onLoadedItemChange={setLoadedItem}
        />
      </View>

      <View style={styles.fieldGrid}>
        <View style={styles.fieldGridItem}>
          <NumberField
            label="Foot length"
            value={measurements.footLengthCm}
            unit={unit}
            required
            onChange={(value) => onChange({ footLengthCm: value ?? 0 })}
          />
        </View>
        <View style={styles.fieldGridItem}>
          <NumberField
            label="Ball circumference"
            value={measurements.footCircumferenceCm}
            unit={unit}
            required
            onChange={(value) => onChange({ footCircumferenceCm: value ?? 0 })}
          />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.summary}>
            {isExpanded ? "▼ More measurements" : "▶ More measurements"}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={[styles.fieldGrid, styles.expandedGrid]}>
            <View style={styles.fieldGridItem}>
              <NumberField
                label="Heel diagonal"
                value={measurements.heelDiagonalCm}
                unit={unit}
                onChange={(value) => onChange({ heelDiagonalCm: value })}
              />
            </View>
            <View style={styles.fieldGridItem}>
              <NumberField
                label="Ankle circumference"
                value={measurements.ankleCircumferenceCm}
                unit={unit}
                onChange={(value) => onChange({ ankleCircumferenceCm: value })}
              />
            </View>
            <View style={styles.fieldGridItem}>
              <NumberField
                label="Heel height"
                value={measurements.heelHeightCm}
                unit={unit}
                onChange={(value) => onChange({ heelHeightCm: value })}
              />
            </View>
            <View style={styles.fieldGridItem}>
              <NumberField
                label="Instep circumference"
                value={measurements.instepCircumferenceCm}
                unit={unit}
                onChange={(value) => onChange({ instepCircumferenceCm: value })}
              />
            </View>
            <View style={styles.fieldGridItem}>
              <NumberField
                label="Toe length"
                value={measurements.toeLengthCm}
                unit={unit}
                onChange={(value) => onChange({ toeLengthCm: value })}
              />
            </View>
            <View style={styles.fieldGridItem}>
              <NumberField
                label="Low calf circumference"
                value={measurements.lowCalfCircumferenceCm}
                unit={unit}
                onChange={(value) =>
                  onChange({ lowCalfCircumferenceCm: value })
                }
              />
            </View>
            <View style={styles.fieldGridItem}>
              <NumberField
                label="High calf circumference"
                value={measurements.highCalfCircumferenceCm}
                unit={unit}
                onChange={(value) =>
                  onChange({ highCalfCircumferenceCm: value })
                }
              />
            </View>
          </View>
        )}
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 24,
  },
  sectionHeadingMain: {
    flexDirection: "row",
    gap: 15,
    flex: 1,
    minWidth: 0,
  },
  headingContent: {
    flex: 1,
    minWidth: 0,
  },
  step: {
    color: "#c75b36",
    fontSize: 14,
    fontFamily: "monospace",
    paddingTop: 8,
  },
  h2: {
    fontFamily: "Georgia",
    fontSize: 24,
    fontWeight: "400",
    color: "#24231f",
    marginBottom: 6,
  },
  loadedItemName: {
    color: "#77746b",
    fontWeight: "400",
    fontSize: 14,
  },
  p: {
    color: "#77746b",
    fontSize: 13,
    marginBottom: 0,
    lineHeight: 18,
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  fieldGridItem: {
    width: "48%",
    minWidth: 140,
    flexGrow: 1,
  },
  expandedGrid: {
    marginTop: 16,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderColor: palette.border,
    marginTop: 24,
    paddingTop: 16,
  },
  summary: {
    color: "#61766b",
    fontSize: 13,
    fontWeight: "700",
  },
});
