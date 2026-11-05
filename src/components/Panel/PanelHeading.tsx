import { ReactNode } from "react";
import { Text, View } from "react-native";
import { LoadedItemInfo } from "../SavedItemsControl";

type Props = {
  step: number;
  heading: string;
  prompt: string;
  loadedItem: LoadedItemInfo | null;
  children: ReactNode;
};

export function PanelHeading({
  step,
  heading,
  prompt,
  loadedItem,
  children,
}: Props) {
  return (
    <View>
      <Text>
        {step.toString().padStart(2, "0")} {heading}
        {loadedItem && (
          <Text>
            {" "}
            — {loadedItem.name}
            {loadedItem.dirty ? " (edited)" : ""}
          </Text>
        )}
      </Text>
      <Text>{prompt}</Text>
      {children}
    </View>
  );
}
