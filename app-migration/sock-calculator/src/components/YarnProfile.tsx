import {
  DEFAULT_YARN_PROFILE,
  type YarnProfile as YarnProfileData,
} from "@/lib/domain";
import { deleteYarnProfile, type LibraryItem } from "@/lib/library";
import { validateYarnProfile } from "@/lib/validation";
import { palette } from "@/theme/colors";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialMixEditor } from "./MaterialMixEditor";
import { LoadedItemInfo, SavedItemsControl } from "./SavedItemsControl";

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
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionHeadingMain}>
          <Text style={styles.step}>02</Text>
          <View>
            <Text style={styles.heading}>
              Yarn profile
              {loadedItem && (
                <Text style={styles.loadedItemName}>
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </Text>
              )}
            </Text>
            <Text style={styles.subheading}>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Manufacturer *</Text>
          <TextInput
            style={styles.input}
            value={profile.manufacturer}
            onChangeText={(text) => onChange({ manufacturer: text })}
            placeholder="Enter manufacturer"
            accessible={true}
            accessibilityLabel="Manufacturer field for yarn profile"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Weight</Text>
          <View style={[styles.select]}>
            {["fingering", "DK", "worsted"].map((weight) => (
              <View
                key={weight}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      profile.weight === weight
                        ? palette.border
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        profile.weight === weight
                          ? palette.textPrimary
                          : palette.hintText,
                    },
                  ]}
                >
                  {weight}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <MaterialMixEditor
        materials={profile.materials}
        onChange={(materials) => onChange({ materials })}
      />
      {errors.length > 0 && <Text style={styles.hint}>{errors[0]}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: palette.panel,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionHeading: {
    marginBottom: 16,
  },
  sectionHeadingMain: {
    marginBottom: 8,
  },
  step: {
    backgroundColor: palette.border,
    color: palette.textPrimary,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginRight: 12,
    fontWeight: "600",
  },
  heading: {
    fontSize: 20,
    color: palette.textPrimary,
    margin: 0,
    fontFamily: "sans-serif",
  },
  subheading: {
    color: palette.hintText,
    marginTop: 4,
    fontSize: 14,
  },
  loadedItemName: {
    color: palette.textPrimary,
    fontStyle: "italic",
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  fieldContainer: {
    flex: 1,
    minWidth: 150,
  },
  label: {
    display: "contents",
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: palette.inputBackground,
    color: palette.textPrimary,
  },
  select: {
    borderWidth: 1,
    borderColor: palette.border,
    padding: 8,
    borderRadius: 6,
    backgroundColor: palette.inputBackground,
  },
  option: {
    padding: 8,
    borderRadius: 4,
  },
  optionText: {
    fontSize: 14,
  },
  hint: {
    color: palette.hintText,
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 8,
  },
});
