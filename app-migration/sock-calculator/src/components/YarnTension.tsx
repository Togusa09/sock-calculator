import {
  type SavedTension,
  type YarnProfile,
  type YarnTension as YarnTensionType,
} from "@/lib/domain";
import { describeYarnProfile, findTension, saveTension } from "@/lib/library";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  tension: YarnTensionType;
  yarnProfile: YarnProfile;
  yarnProfileId?: string;
  onChange: (update: Partial<YarnTensionType>) => void;
};

function toGauge(saved: SavedTension): YarnTensionType {
  const { yarnProfileId: _ignored, ...gauge } = saved;
  void _ignored;
  return gauge;
}

export function YarnTension({
  tension,
  yarnProfile,
  yarnProfileId,
  onChange,
}: Props) {
  const [status, setStatus] = useState("");
  const [lookupFound, setLookupFound] = useState(false);

  useEffect(() => {
    const found = yarnProfileId
      ? findTension(yarnProfileId, tension.needleSizeMm)
      : undefined;
    // setStatus("");
    // setLookupFound(!!found);
    if (found) onChange(toGauge(found.data));
  }, [yarnProfileId, tension.needleSizeMm]);

  function handleSave() {
    if (!yarnProfileId) return;
    saveTension(
      yarnProfileId,
      tension,
      `${yarnProfile.manufacturer} ${yarnProfile.weight} @ ${tension.needleSizeMm} mm`,
    );
    setLookupFound(true);
    setStatus("Tension saved.");
  }

  return (
    <View style={styles.panel}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.step}>03</Text>
          <View style={styles.headingContent}>
            <Text style={styles.h2}>Yarn tension</Text>
            <Text style={styles.p}>
              {yarnProfileId
                ? `${describeYarnProfile(yarnProfile)} — gauge and ease shape the fit.`
                : "Save a yarn profile to look up and store tensions."}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondary,
            !yarnProfileId && styles.disabled,
          ]}
          disabled={!yarnProfileId}
          onPress={handleSave}
        >
          <Text style={styles.secondaryButtonText}>Save for yarn + needle</Text>
        </TouchableOpacity>
      </View>
      {yarnProfileId && (
        <Text style={styles.hint}>
          {status ||
            (lookupFound
              ? "Loaded saved tension for this yarn and needle size."
              : "No saved tension for this yarn and needle size yet; enter a gauge and save it.")}
        </Text>
      )}
      <View style={styles.fieldGrid}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Stitches per 10 cm *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(tension.stitchesPer10Cm)}
            onChangeText={(text) => onChange({ stitchesPer10Cm: Number(text) })}
          />
          <Text style={styles.fieldSmall}>sts</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Rows per 10 cm *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(tension.rowsPer10Cm)}
            onChangeText={(text) => onChange({ rowsPer10Cm: Number(text) })}
          />
          <Text style={styles.fieldSmall}>rows</Text>
        </View>
      </View>
      <Text style={styles.hint}>
        A swatch under 10 cm can be less accurate. The gauge above is stored in
        metric regardless of display unit.
      </Text>
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
  p: {
    color: "#77746b",
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondary: {
    backgroundColor: "#24231f",
  },
  disabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    color: "#fffdf8",
    fontSize: 12,
    fontWeight: "700",
  },
  hint: {
    color: "#77746b",
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 18,
  },
  fieldGrid: {
    flexDirection: "row",
    gap: 18,
  },
  field: {
    flex: 1,
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
