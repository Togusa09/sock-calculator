import type { YarnProfile, YarnWeightUnit } from "@/lib/domain";
import { Text, TextInput, View } from "react-native";
import { PlatformPicker } from "../ui/PlatformPicker";
import { MaterialMixEditor } from "../wizard/MaterialMixEditor";

type Props = {
  profile: YarnProfile;
  onChange: (profile: YarnProfile) => void;
};

export function YarnProfileForm({ profile, onChange }: Props) {
  return (
    <>
      <View>
        <Text>Manufacturer *</Text>
        <TextInput
          value={profile.manufacturer}
          onChangeText={(text) => onChange({ ...profile, manufacturer: text })}
        />
      </View>
      <View>
        <Text>Weight</Text>
        <PlatformPicker
          selectedValue={profile.weight}
          onValueChange={(itemValue) =>
            onChange({
              ...profile,
              weight: itemValue as YarnWeightUnit,
            })
          }
          items={[
            { label: "Fingering", value: "fingering" },
            { label: "DK", value: "DK" },
            { label: "Worsted", value: "worsted" },
          ]}
        />
      </View>
      <MaterialMixEditor
        materials={profile.materials}
        onChange={(materials) => onChange({ ...profile, materials })}
      />
    </>
  );
}
