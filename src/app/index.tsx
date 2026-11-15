import { FeatureToggle } from "@/components/FeatureToggle";
import { ImportExportData } from "@/components/ImportExportData";
import { Picker } from "@react-native-picker/picker";

import { ResultsPanel } from "@/components/ResultsPanel";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import { ClearButton } from "@/components/ui/ClearButton";
import LabeledField, { fieldControlStyle } from "@/components/ui/LabeledField";
import { Construction } from "@/components/wizard/Construction";
import { FootMeasurements } from "@/components/wizard/FootMeasurements";
import { YarnProfile } from "@/components/wizard/YarnProfile";
import { YarnTension } from "@/components/wizard/YarnTension";
import { calculateStitches } from "@/lib/calculations";
import {
  DEFAULT_RECORD,
  DEFAULT_YARN_PROFILE,
  DisplayUnit,
} from "@/lib/domain";
import { validateRecord } from "@/lib/validation";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useDataPersistence } from "../hooks/UseDataPersistence";

const displayUnits = [
  { label: "Metric", value: "metric" },
  { label: "Imperial", value: "imperial" },
];

export default function Home() {
  const {
    record,
    setRecord,
    updateRecord,
    updateMeasurements,
    updateTension,
    updateConstruction,
  } = useDataPersistence();

  const [message, setMessage] = useState("");
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  const unit = record.displayUnit;
  const result = useMemo(() => calculateStitches(record), [record]);
  const errors = validateRecord(record);

  return (
    <ScrollView>
      <View>
        <Text>
          Sock calculator
          {loadedItem && (
            <Text>
              {" "}
              — {loadedItem.name}
              {loadedItem.dirty ? " (edited)" : ""}
            </Text>
          )}
        </Text>

        <LabeledField label="Display" required>
          <Picker
            accessibilityLabel="Display"
            style={fieldControlStyle()}
            selectedValue={unit}
            onValueChange={(value) =>
              updateRecord({ displayUnit: value as DisplayUnit })
            }
          >
            {displayUnits.map((f) => (
              <Picker.Item key={f.value} label={f.label} value={f.value} />
            ))}
          </Picker>
        </LabeledField>

        <SavedItemsControl
          type="project"
          data={record}
          defaultData={DEFAULT_RECORD}
          onLoad={(loaded) => {
            const validationErrors = validateRecord(loaded);
            if (validationErrors.length > 0) {
              setMessage(validationErrors[0]);
              return;
            }
            setRecord(loaded);
            setMessage("Project loaded.");
          }}
          onLoadedItemChange={setLoadedItem}
        />

        <FeatureToggle feature="config">
          <Link href="/config" asChild>
            <Pressable accessibilityRole="link">
              <Text>Configuration</Text>
            </Pressable>
          </Link>
        </FeatureToggle>

        <ImportExportData
          onImported={(data) => setRecord(data)}
          onError={() => {}}
          onExported={() => {}}
        />
      </View>

      {message !== "" && <Text accessibilityRole="text">{message}</Text>}

      <View>
        <FootMeasurements
          measurements={record.measurements}
          unit={unit}
          onChange={updateMeasurements}
        />
        <YarnProfile
          profile={record.yarnProfile ?? DEFAULT_YARN_PROFILE}
          profileId={record.yarnProfileId}
          onChange={(update) =>
            updateRecord({
              yarnProfile: {
                ...(record.yarnProfile ?? DEFAULT_YARN_PROFILE),
                ...update,
              },
            })
          }
          onSelect={(yarnProfile, yarnProfileId) =>
            updateRecord({ yarnProfile, yarnProfileId })
          }
        />
        <YarnTension
          tension={record.tension}
          yarnProfile={record.yarnProfile ?? DEFAULT_YARN_PROFILE}
          yarnProfileId={record.yarnProfileId}
          onChange={updateTension}
        />
        <Construction
          construction={record.construction}
          tensionNegativeEase={record.tension.negativeEasePercent}
          onChange={updateConstruction}
        />
        <ClearButton
          onPress={() => {
            setRecord(DEFAULT_RECORD);
            setMessage("Defaults restored.");
          }}
        >
          Restore defaults
        </ClearButton>
      </View>

      <ResultsPanel result={result} unit={unit} validation={errors} />
    </ScrollView>
  );
}
