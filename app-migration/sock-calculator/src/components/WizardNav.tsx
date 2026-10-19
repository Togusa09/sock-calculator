import { palette } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
};

export function WizardNav({ onBack, onNext, nextLabel = "Next" }: Props) {
  return (
    <View style={styles.wizardNav} className="wizard-nav">
      {onBack ? (
        <Pressable
          className="button reset"
          onPress={onBack}
          style={({ pressed }) => [
            styles.button,
            styles.buttonReset,
            pressed && styles.buttonPressed,
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[styles.buttonText, pressed && styles.buttonTextPressed]}
            >
              Back
            </Text>
          )}
        </Pressable>
      ) : (
        <View />
      )}
      {onNext && (
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [
            styles.button,
            styles.buttonSecondary,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, styles.textSecondary]}>
            {nextLabel}
          </Text>
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
  // Base button design
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // Active/Pressed State (Alternative to hover on mobile)
  buttonPressed: {
    transform: [{ translateY: -1 }],
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 12 * 0.04, // Em maps to numeric multiplication in React Native
    color: palette.textPrimary, // was #000000
  },
  buttonTextPressed: {
    opacity: 0.8,
  },
  // Modifiers
  buttonReset: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border,
  },
  buttonSecondary: {
    backgroundColor: palette.textPrimary,
  },
  textSecondary: {
    color: palette.textSecondary,
  },
});
