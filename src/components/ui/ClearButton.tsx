import { ReactNode } from "react";
import { Pressable, Text } from "react-native";

type Props = {
  children: ReactNode;
  onPress: () => void;
};

export function ClearButton({ children, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onPress()}>
      <Text>{children}</Text>
    </Pressable>
  );
}
