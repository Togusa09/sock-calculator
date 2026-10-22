import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import {
  DEFAULT_YARN_PROFILE,
  YarnWeightUnit,
  type YarnProfile as YarnProfileData,
} from "@/lib/domain";
import { deleteYarnProfile, LibraryItem } from "@/lib/library";
import { validateYarnProfile } from "@/lib/validation";
import { palette } from "@/theme/colors";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Panel } from "../Panel/Panel";
import { PanelHeading } from "../Panel/PanelHeading";
import { PlatformPicker } from "../ui/PlatformPicker";
import { MaterialMixEditor } from "./MaterialMixEditor";

type Props = {
  profile: YarnProfileData;
  profileId?: string;
  onChange: (update: Partial<YarnProfileData>) => void;
  onSelect: (profile: YarnProfileData, profileId?: string) => void;
};

export function YarnProfile({ profile, profileId, onChange, onSelect }: Props) {
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  const errors = validateYarnProfile(profile);

  function handleDelete(id: string) {
    deleteYarnProfile(id);
    if (id === profileId) onSelect(DEFAULT_YARN_PROFILE, undefined);
  }

  return (
    <Panel>
      <PanelHeading
        step={2}
        heading={"Yarn profile"}
        prompt={"Save a profile to link tensions to this yarn."}
        loadedItem={loadedItem}
      >
        <SavedItemsControl
          type="yarnProfile"
          data={profile}
          defaultData={DEFAULT_YARN_PROFILE}
          onLoad={(data, item?: LibraryItem<YarnProfileData>) =>
            onSelect(data, item?.id)
          }
          onSaved={(item) => onSelect(item.data, item.id)}
          onDelete={handleDelete}
          onLoadedItemChange={setLoadedItem}
        />
      </PanelHeading>
      <View style={styles.fieldGrid}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Manufacturer *</Text>
          <TextInput
            style={styles.input}
            value={profile.manufacturer}
            onChangeText={(text) => onChange({ manufacturer: text })}
          />
        </View>
        <PlatformPicker
          selectedValue={profile.weight}
          onValueChange={(weight) =>
            onChange({ weight: weight as YarnWeightUnit })
          }
          items={[
            { label: "Fingering", value: "fingering" },
            { label: "DK", value: "DK" },
            { label: "Worsted", value: "worsted" },
          ]}
        >
          {/* <Picker.Item value="fingering" label="Fingering" />
          <Picker.Item value="DK" label="DK" />
          <Picker.Item value="worsted" label="Worsted" /> */}
        </PlatformPicker>
      </View>
      <MaterialMixEditor
        materials={profile.materials}
        onChange={(materials) => onChange({ materials })}
      />
      {errors.length > 0 && <Text style={styles.hint}>{errors[0]}</Text>}
    </Panel>
  );
}

const styles = StyleSheet.create({
  fieldGrid: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 16,
  },
  field: {
    flex: 1,
    gap: 7,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#77746b",
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
  hint: {
    color: "#77746b",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 20,
  },
});
