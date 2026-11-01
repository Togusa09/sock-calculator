import { Host, Picker } from "@expo/ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PlatformPickerProps } from "./PlatformPicker.types";

export type { PlatformPickerItem } from "./PlatformPicker.types";

export const PlatformPicker: React.FC<PlatformPickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {/* Host must be the direct parent of the Picker */}
      <Host matchContents={{ vertical: true }} style={styles.host}>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </Host>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
    maxWidth: 400,
    minWidth: 0,
  },
  host: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
});
