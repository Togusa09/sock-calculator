import { palette } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type WizardTab = {
  id: string;
  label: string;
  step: string;
  hasError?: boolean;
  /** Only shown in the compact (mobile) layout. */
  mobileOnly?: boolean;
};

type Props = {
  tabs: WizardTab[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function WizardTabs({ tabs, activeId, onSelect }: Props) {
  // Keyboard navigation simplified for React Native
  // Accessibility handled via accessibilityProps on elements

  return (
    <View className="wizard-tabs" accessible={true}>
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelect(tab.id)}
            className={[
              "wizard-tab",
              selected ? "is-active" : "",
              tab.mobileOnly ? "mobile-only" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Text style={styles.wizardTab}>
              <Text style={styles.wizardTabStep}>{tab.step}</Text>
              <Text style={styles.wizardTabLabel}>{tab.label}</Text>
              {tab.hasError && <Text style={styles.wizardTabError}>!</Text>}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wizardTabs: {
    flexDirection: "column",
    gap: 6,
  },
  wizardTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 2,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.border,
  },
  wizardTabActive: {
    fontWeight: "600",
    borderColor: palette.textPrimary,
  },
  wizardTabStep: {
    fontSize: 11,
    opacity: 0.6,
  },
  wizardTabLabel: {
    flex: 1,
  },
  wizardTabError: {
    color: palette.error,
    fontWeight: "700",
  },
});
