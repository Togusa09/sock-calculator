import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
};

export function WizardNav({ onBack, onNext, nextLabel = "Next" }: Props) {
  return (
    <View style={styles.wizardNav}>
      {onBack ? (
        <TouchableOpacity
          style={[styles.button, styles.reset]}
          onPress={onBack}
        >
          <Text style={styles.resetText}>Back</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {onNext && (
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={onNext}
        >
          <Text style={styles.secondaryText}>{nextLabel}</Text>
        </TouchableOpacity>
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
    borderColor: "#ddd8ca",
  },
  resetText: {
    color: "#77746b",
    fontSize: 12,
    fontWeight: "700",
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
