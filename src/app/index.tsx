import { FeatureToggle } from "@/components/FeatureToggle";
import { ImportExportData } from "@/components/ImportExportData";
import { fieldControlStyle, sharedStyles } from "@/theme/styles";
import { Picker } from "@react-native-picker/picker";

import { ResultsPanel } from "@/components/ResultsPanel";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import LabeledField from "@/components/ui/LabeledField";
import { NavButton } from "@/components/ui/NavButton";
import { Wizard, WizardStep } from "@/components/Wizard";
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
import { useMemo, useRef, useState } from "react";
import { ScrollView, Text, View, type ScrollViewInstance } from "react-native";
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

  const scrollViewRef = useRef<ScrollViewInstance>(null);
  const [targetY, setTargetY] = useState(0);

  const handleScroll = () => {
    scrollViewRef.current?.scrollTo({
      y: targetY,
      animated: true,
    });
  };

  return (
    <ScrollView style={sharedStyles.container} ref={scrollViewRef}>
      <View>
        <Text style={sharedStyles.title}>
          Sock calculator
          {loadedItem && (
            <Text>
              {" "}
              — {loadedItem.name}
              {loadedItem.dirty ? " (edited)" : ""}
            </Text>
          )}
        </Text>

        <LabeledField label="Display Unit" required>
          <Picker
            accessibilityLabel="Display Unit"
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

        <View style={sharedStyles.row}>
          <FeatureToggle feature="config">
            {/* <Link href="/config" asChild>
            <Pressable accessibilityRole="link">
              <Text>Edit Configuration</Text>
            </Pressable>
          </Link> */}
            <NavButton href="/config">Edit Configuration</NavButton>
          </FeatureToggle>

          <ImportExportData
            onImported={(data) => setRecord(data)}
            onError={() => {}}
            onExported={() => {}}
          />
        </View>
      </View>

      {message !== "" && <Text accessibilityRole="text">{message}</Text>}

      <View>
        <Wizard
          canAdvance={() => true}
          onFinish={() => {
            //setMessage("Wizard completed.");
            handleScroll();
          }}
        >
          <WizardStep
            id="foot"
            label="Foot Measurements"
            component={
              <FootMeasurements
                measurements={record.measurements}
                unit={unit}
                onChange={updateMeasurements}
              />
            }
          />
          <WizardStep
            id="yarn"
            label="Yarn Profile"
            component={
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
            }
          />
          <WizardStep
            id="tension"
            label="Yarn Tension"
            component={
              <YarnTension
                tension={record.tension}
                yarnProfile={record.yarnProfile ?? DEFAULT_YARN_PROFILE}
                yarnProfileId={record.yarnProfileId}
                onChange={updateTension}
              />
            }
          />
          <WizardStep
            id="construction"
            label="Construction"
            component={
              <Construction
                construction={record.construction}
                tensionNegativeEase={record.tension.negativeEasePercent}
                onChange={updateConstruction}
              />
            }
          />
        </Wizard>
      </View>

      {/* <View>
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
        <BasicButton
          onPress={() => {
            setRecord(DEFAULT_RECORD);
            setMessage("Defaults restored.");
          }}
        >
          Restore defaults
        </BasicButton>
      </View> */}
      {/* Marker for top of results panel */}
      <View
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setTargetY(layout.y);
        }}
      ></View>
      <ResultsPanel result={result} unit={unit} validation={errors} />
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     maxWidth: 800,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     margin: 16,
//   },
// });
// const styles = StyleSheet.create({});
