import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  type SavedTension,
  type YarnProfile,
  type YarnTension,
} from "@/lib/domain";
import { describeYarnProfile, findTension, saveTension } from "@/lib/library";
import { palette } from "@/theme/colors";
import { useEffect, useState } from "react";

type Props = {
  tension: YarnTension;
  yarnProfile: YarnProfile;
  yarnProfileId?: string;
  onChange: (update: Partial<YarnTension>) => void;
};

function toGauge(saved: SavedTension): YarnTension {
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

  // Look up the saved tension whenever the selected yarn or needle size changes.
  useEffect(() => {
    const found = yarnProfileId
      ? findTension(yarnProfileId, tension.needleSizeMm)
      : undefined;
    // Syncing UI state with the external localStorage library.
    /* eslint-disable react-hooks/set-state-in-effect */
    setStatus("");
    setLookupFound(!!found);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (found) onChange(toGauge(found.data));
    // Only re-run on selection changes, not on gauge edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <View style={styles.stepContainer}>
            <Text style={styles.stepText}>03</Text>
          </View>
          <View style={styles.headingText}>
            <Text style={styles.h2}>Yarn tension</Text>
            <Text style={styles.p}>
              {yarnProfileId
                ? `${describeYarnProfile(yarnProfile)} — gauge and ease shape the fit.`
                : "Save a yarn profile to look up and store tensions."}
            </Text>
          </View>
        </View>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          disabled={!yarnProfileId}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save for this yarn + needle</Text>
        </Pressable>
      </View>
      {yarnProfileId && (
        <Text style={styles.hint} role="status">
          {status ||
            (lookupFound
              ? "Loaded saved tension for this yarn and needle size."
              : "No saved tension for this yarn and needle size yet; enter a gauge and save it.")}
        </Text>
      )}

      <View style={styles.fieldGrid}>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>Stitches per 10 cm *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={5}
            onChangeText={(text) => {
              const value = Number(text);
              onChange({ stitchesPer10Cm: value });
            }}
            value={tension.stitchesPer10Cm.toString()}
          />
          <Text style={styles.smallText}>sts</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>Rows per 10 cm *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={5}
            onChangeText={(text) => {
              const value = Number(text);
              onChange({ rowsPer10Cm: value });
            }}
            value={tension.rowsPer10Cm.toString()}
          />
          <Text style={styles.smallText}>rows</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>Needle size</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={6}
            onChangeText={(text) => {
              const value = Number(text);
              onChange({ needleSizeMm: value });
            }}
            value={tension.needleSizeMm.toString()}
          />
          <Text style={styles.smallText}>mm</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>Negative ease</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={(text) => {
              const value = Number(text);
              onChange({ negativeEasePercent: value });
            }}
            value={tension.negativeEasePercent.toString()}
          />
          <Text style={styles.smallText}>%</Text>
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
    backgroundColor: palette.panel,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionHeading: {
    marginBottom: 12,
  },
  sectionHeadingMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepContainer: {
    marginRight: 12,
  },
  stepText: {
    backgroundColor: palette.border,
    color: palette.textPrimary,
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontWeight: "bold",
    minWidth: 40,
    textAlign: "center",
  },
  headingText: {
    flex: 1,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 4,
  },
  p: {
    fontSize: 14,
    color: palette.textPrimary,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 200,
  },
  buttonSecondary: {
    backgroundColor: palette.border,
  },
  buttonText: {
    color: palette.textPrimary,
    fontWeight: "500",
  },
  hint: {
    fontSize: 13,
    color: palette.hintText,
    marginBottom: 8,
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  fieldContainer: {
    flex: 1,
    minWidth: 120,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: palette.textPrimary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: palette.panel,
    color: palette.textPrimary,
  },
  smallText: {
    fontSize: 12,
    color: palette.hintText,
    marginTop: 4,
  },
});
