import type { YarnProfile, YarnWeightUnit } from "@/lib/domain";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native";
import LabeledField from "../ui/LabeledField";
import { MaterialMixEditor } from "../wizard/MaterialMixEditor";

type Props = {
  profile: YarnProfile;
  onChange: (profile: YarnProfile) => void;
};

export function YarnProfileForm({ profile, onChange }: Props) {
  return (
    <>
      <LabeledField label="Manufacturer" required>
        <TextInput
          value={profile.manufacturer}
          onChangeText={(text) => onChange({ ...profile, manufacturer: text })}
        />
      </LabeledField>
      <LabeledField label="Weight" required>
        <Picker
          accessibilityLabel="Weight"
          selectedValue={profile.weight}
          onValueChange={(itemValue) =>
            onChange({
              ...profile,
              weight: itemValue as YarnWeightUnit,
            })
          }
        >
          <Picker.Item label="Fingering" value="fingering" />
          <Picker.Item label="DK" value="DK" />
          <Picker.Item label="Worsted" value="worsted" />
        </Picker>
      </LabeledField>

      <MaterialMixEditor
        materials={profile.materials}
        onChange={(materials) => onChange({ ...profile, materials })}
      />
    </>
  );
}
