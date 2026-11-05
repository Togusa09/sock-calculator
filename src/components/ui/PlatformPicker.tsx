import { Picker } from "@expo/ui";
import React from "react";
import { Text, View } from "react-native";

import type { PlatformPickerProps } from "./PlatformPicker.types";

export type { PlatformPickerItem } from "./PlatformPicker.types";

export const PlatformPicker: React.FC<PlatformPickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  label,
}) => {
  return (
    <View>
      {label && <Text>{label}</Text>}
      <View>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};
