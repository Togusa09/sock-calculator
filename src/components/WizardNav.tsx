import { palette } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BasicButton } from "./ui/BasicButton";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
};

export function WizardNav({ onBack, onNext, nextLabel = "Next" }: Props) {
  return (
    <View style={styles.wizardNav}>
      {onBack ? <BasicButton onPress={onBack}>Back</BasicButton> : <View />}
      {onNext && (
        <Pressable style={[styles.button, styles.secondary]} onPress={onNext}>
          <Text style={styles.secondaryText}>{nextLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wizardNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  reset: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border,
  },
  secondary: {
    backgroundColor: "#24231f",
  },
  secondaryText: {
    color: "#fffdf8",
    fontSize: 12,
    fontWeight: "700",
  },
});
