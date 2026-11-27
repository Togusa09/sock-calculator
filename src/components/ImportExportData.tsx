import { useDataPersistence } from "@/hooks/UseDataPersistence";
import { CalculatorRecord } from "@/lib/domain";
import { parseImportedRecord } from "@/lib/validation";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { Platform } from "react-native";
import { BasicButton } from "./ui/BasicButton";

type Props = {
  //   onMessageUpdate: (mesage: string) => void;
  onExported: () => void;
  onImported: (data: CalculatorRecord) => void;
  onError: () => void;
};

export function ImportExportData({ onImported }: Props) {
  const { record } = useDataPersistence();

  async function ImportData() {
    try {
      console.log("Importing file");
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/json"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("Cancelled");
        return;
      }

      const successResult =
        result as DocumentPicker.DocumentPickerSuccessResult;
      if (successResult.assets.length !== 1) {
        console.log("Incorrect number of files selected");
        return;
      }

      const asset = result.assets[0];
      let fileString = "";

      if (Platform.OS === "web") {
        // On web, result.assets[0].file contains the standard Web File object
        if (asset.file) {
          fileString = await asset.file.text();
        } else {
          throw new Error("Web file object not found.");
        }
      } else {
        // On iOS / Android, pass the picked file URI into the new File class
        const file = new File(asset.uri);
        fileString = await file.text(); // Reads text content asynchronously
      }

      //const parsedData = JSON.parse(fileString);
      const data = parseImportedRecord(fileString);
      onImported(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function ExportData() {
    let filename = "exported_data.json";
    try {
      const jsonString = JSON.stringify(record);

      if (Platform.OS === "web") {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Native Export (iOS/Android) using modern File API & Expo Sharing
        const file = new File(Paths.cache, filename);
        await file.write(jsonString);

        const isAvailable = await isAvailableAsync();
        if (isAvailable) {
          await shareAsync(file.uri, {
            mimeType: "application/json",
            dialogTitle: "Export JSON File",
            UTI: "public.json",
          });
        } else {
          //      Alert.alert('Sharing Unavailable', `Saved to ${file.uri}`);
        }
      }
    } catch (error) {
      console.error("Error exporting JSON file:", error);
      //Alert.alert('Error', 'Failed to export JSON file.');
    }
  }

  return (
    <>
      <BasicButton onPress={ExportData}>Export JSON</BasicButton>
      <BasicButton onPress={ImportData}>Import JSON</BasicButton>
    </>
  );
}
