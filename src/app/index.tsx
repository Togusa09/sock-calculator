import { type LoadedItemInfo } from "@/components/SavedItemsControl";
import { calculateStitches } from "@/lib/calculations";
import { validateRecord } from "@/lib/validation";
import { Host, ScrollView } from "@expo/ui";
import { useMemo, useState } from "react";
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
    <Host>
      <ScrollView></ScrollView>
    </Host>
  );

  // return (
  //   <ScrollView>
  //     <View>
  //       <Text>
  //         Sock calculator
  //         {loadedItem && (
  //           <Text>
  //             {" "}
  //             — {loadedItem.name}
  //             {loadedItem.dirty ? " (edited)" : ""}
  //           </Text>
  //         )}
  //       </Text>

  //       <View>
  //         <Text>Display</Text>
  //         <PlatformPicker
  //           selectedValue={unit}
  //           onValueChange={(value) =>
  //             updateRecord({ displayUnit: value as DisplayUnit })
  //           }
  //           items={displayUnits.map<PlatformPickerItem>((f) => ({
  //             label: f.label,
  //             value: f.value,
  //           }))}
  //         />
  //       </View>

  //       <SavedItemsControl
  //         type="project"
  //         data={record}
  //         defaultData={DEFAULT_RECORD}
  //         onLoad={(loaded) => {
  //           const validationErrors = validateRecord(loaded);
  //           if (validationErrors.length > 0) {
  //             setMessage(validationErrors[0]);
  //             return;
  //           }
  //           setRecord(loaded);
  //           setMessage("Project loaded.");
  //         }}
  //         onLoadedItemChange={setLoadedItem}
  //       />

  //       <FeatureToggle feature="config">
  //         <Link href="/config" asChild>
  //           <Pressable accessibilityRole="link">
  //             <Text>Configuration</Text>
  //           </Pressable>
  //         </Link>
  //       </FeatureToggle>

  //       <ImportExportData
  //         onImported={(data) => setRecord(data)}
  //         onError={() => {}}
  //         onExported={() => {}}
  //       />
  //     </View>

  //     {message !== "" && <Text accessibilityRole="text">{message}</Text>}

  //     <View>
  //       <FootMeasurements
  //         measurements={record.measurements}
  //         unit={unit}
  //         onChange={updateMeasurements}
  //       />
  //       <YarnProfile
  //         profile={record.yarnProfile ?? DEFAULT_YARN_PROFILE}
  //         profileId={record.yarnProfileId}
  //         onChange={(update) =>
  //           updateRecord({
  //             yarnProfile: {
  //               ...(record.yarnProfile ?? DEFAULT_YARN_PROFILE),
  //               ...update,
  //             },
  //           })
  //         }
  //         onSelect={(yarnProfile, yarnProfileId) =>
  //           updateRecord({ yarnProfile, yarnProfileId })
  //         }
  //       />
  //       <YarnTension
  //         tension={record.tension}
  //         yarnProfile={record.yarnProfile ?? DEFAULT_YARN_PROFILE}
  //         yarnProfileId={record.yarnProfileId}
  //         onChange={updateTension}
  //       />
  //       <Construction
  //         construction={record.construction}
  //         tensionNegativeEase={record.tension.negativeEasePercent}
  //         onChange={updateConstruction}
  //       />
  //       <ClearButton
  //         onPress={() => {
  //           setRecord(DEFAULT_RECORD);
  //           setMessage("Defaults restored.");
  //         }}
  //       >
  //         Restore defaults
  //       </ClearButton>
  //     </View>

  //     <ResultsPanel result={result} unit={unit} validation={errors} />
  //   </ScrollView>
  // );
}
