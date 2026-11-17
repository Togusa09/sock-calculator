import {
  type SavedTension,
  type YarnProfile,
  type YarnTension as YarnTensionType,
} from "@/lib/domain";
import { describeYarnProfile, findTension, saveTension } from "@/lib/library";
import { fieldControlStyle } from "@/theme/styles";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Panel } from "../Panel/Panel";
import LabeledField from "../ui/LabeledField";

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
    (async () => {
      const found = yarnProfileId
        ? await findTension(yarnProfileId, tension.needleSizeMm)
        : undefined;
      if (found) onChange(toGauge(found.data));
    })();
  }, [yarnProfileId, tension.needleSizeMm, onChange]);

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
    <Panel>
      <View>
        <Text>03 Yarn tension</Text>
        <Text>
          {yarnProfileId
            ? `${describeYarnProfile(yarnProfile)} — gauge and ease shape the fit.`
            : "Save a yarn profile to look up and store tensions."}
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={!yarnProfileId}
          onPress={handleSave}
        >
          <Text>Save for yarn + needle</Text>
        </Pressable>
      </View>
      {yarnProfileId && (
        <Text>
          {status ||
            (lookupFound
              ? "Loaded saved tension for this yarn and needle size."
              : "No saved tension for this yarn and needle size yet; enter a gauge and save it.")}
        </Text>
      )}
      <LabeledField label="Stitches per 10 cm" required responsive>
        <TextInput
          style={fieldControlStyle()}
          keyboardType="numeric"
          value={String(tension.stitchesPer10Cm)}
          onChangeText={(text) => onChange({ stitchesPer10Cm: Number(text) })}
        />
      </LabeledField>
      <LabeledField label="Rows per 10 cm" required responsive>
        <TextInput
          style={fieldControlStyle()}
          keyboardType="numeric"
          value={String(tension.rowsPer10Cm)}
          onChangeText={(text) => onChange({ rowsPer10Cm: Number(text) })}
        />
      </LabeledField>
      <LabeledField label="Needle size (mm)" required responsive>
        <TextInput
          style={fieldControlStyle()}
          testID="needle-size-field"
          keyboardType="decimal-pad"
          value={String(tension.needleSizeMm)}
          onChangeText={(text) => onChange({ needleSizeMm: Number(text) })}
        />
      </LabeledField>
      <Text>
        A swatch under 10 cm can be less accurate. The gauge above is stored in
        metric regardless of display unit.
      </Text>
    </Panel>
  );
}
