import { MaterialMixEditor } from "@/components/MaterialMixEditor";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import {
  DEFAULT_YARN_PROFILE,
  type YarnProfile as YarnProfileData,
} from "@/lib/domain";
import { deleteYarnProfile, type LibraryItem } from "@/lib/library";
import { validateYarnProfile } from "@/lib/validation";
import { palette } from "@/theme/colors";
import { Picker } from "@expo/ui";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Panel } from "./ui/Panel";

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
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.step}>02</Text>
          <View style={styles.headingContent}>
            <Text style={styles.h2}>
              Yarn profile
              {loadedItem && (
                <Text style={styles.loadedItemName}>
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </Text>
              )}
            </Text>
            <Text style={styles.p}>
              Save a profile to link tensions to this yarn.
            </Text>
          </View>
        </View>
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
      </View>
      <View style={styles.fieldGrid}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Manufacturer *</Text>
          <TextInput
            style={styles.input}
            value={profile.manufacturer}
            onChangeText={(text) => onChange({ manufacturer: text })}
          />
        </View>
        <Picker
          selectedValue={profile.weight}
          onValueChange={(weight) => onChange({ weight })}
        >
          <Picker.Item value="fingering" label="Fingering" />
          <Picker.Item value="DK" label="DK" />
          <Picker.Item value="worsted" label="Worsted" />
        </Picker>
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
