import type { YarnProfile, YarnWeightUnit } from "@/lib/domain";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { PlatformPicker } from "../ui/PlatformPicker";
import { MaterialMixEditor } from "../wizard/MaterialMixEditor";

type Props = {
  profile: YarnProfile;
  onChange: (profile: YarnProfile) => void;
};

export function YarnProfileForm({ profile, onChange }: Props) {
  return (
    <>
      <View style={styles.fieldGrid}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Manufacturer *</Text>
          <TextInput
            style={styles.input}
            value={profile.manufacturer}
            onChangeText={(text) =>
              onChange({ ...profile, manufacturer: text })
            }
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Weight</Text>
          <View style={styles.selectWrapper}>
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
            >
              {/* <Picker.Item label="Fingering" value="fingering" />
              <Picker.Item label="DK" value="DK" />
              <Picker.Item label="Worsted" value="worsted" /> */}
            </PlatformPicker>
          </View>
        </View>
      </View>
      <MaterialMixEditor
        materials={profile.materials}
        onChange={(materials) => onChange({ ...profile, materials })}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    marginBottom: 18,
  },
  field: {
    flex: 1,
    minWidth: 200,
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
  selectWrapper: {
    backgroundColor: "#faf8f2",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    borderRadius: 2,
    justifyContent: "center",
  },
  select: {
    color: "#24231f",
    height: 44,
  },
});
