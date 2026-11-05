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
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
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
      <View testID="yarn-manufacturer-field">
        <Text>Manufacturer *</Text>
        <TextInput
          value={profile.manufacturer}
          onChangeText={(text) => onChange({ manufacturer: text })}
        />
      </View>
      <View testID="yarn-weight-field">
        <Text>Weight</Text>
        <PlatformPicker
          flush
          selectedValue={profile.weight}
          onValueChange={(weight) =>
            onChange({ weight: weight as YarnWeightUnit })
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
        onChange={(materials) => onChange({ materials })}
      />
      {errors.length > 0 && <Text>{errors[0]}</Text>}
    </Panel>
  );
}
