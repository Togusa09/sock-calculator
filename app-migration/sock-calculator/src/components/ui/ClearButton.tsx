import { palette } from "@/theme/colors";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  children: ReactNode;
  onPress: () => void;
};

export function ClearButton({ children, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles.reset,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => onPress()}
    >
      <Text style={styles.resetText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  reset: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd8ca",
  },
  resetText: {
    color: "#77746b",
    fontSize: 12,
    fontWeight: "700",
  },
  buttonPressed: {
    // transform: [{ translateY: -1 }],
    backgroundColor: palette.inputBackground,
  },
});
