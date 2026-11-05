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
      <select
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </View>
  );
};
