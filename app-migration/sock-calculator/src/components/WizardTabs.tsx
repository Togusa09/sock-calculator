import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type WizardTab = {
  id: string;
  label: string;
  step: string;
  hasError?: boolean;
  mobileOnly?: boolean;
};

type Props = {
  tabs: WizardTab[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function WizardTabs({ tabs, activeId, onSelect }: Props) {
  return (
    <View style={styles.wizardTabs} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <TouchableOpacity
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[
              styles.wizardTab,
              selected && styles.isActive,
              tab.mobileOnly && styles.mobileOnly,
            ]}
            onPress={() => onSelect(tab.id)}
          >
            <Text style={styles.wizardTabStep}>{tab.step}</Text>
            <Text
              style={[styles.wizardTabLabel, selected && styles.isActiveLabel]}
            >
              {tab.label}
            </Text>
            {tab.hasError && (
              <Text
                style={styles.wizardTabError}
                accessibilityRole="image"
                accessibilityLabel="Needs attention"
              >
                !
              </Text>
            )}
          </TouchableOpacity>
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    borderRadius: 2,
  },
  isActive: {
    backgroundColor: "#fffdf8",
    borderColor: "#24231f",
  },
  wizardTabStep: {
    fontSize: 11,
    opacity: 0.6,
    color: "#24231f",
  },
  wizardTabLabel: {
    color: "#24231f",
  },
  isActiveLabel: {
    fontWeight: "600",
  },
  wizardTabError: {
    marginLeft: "auto",
    color: "#7d3320",
    fontWeight: "700",
  },
  mobileOnly: {
    display: "none",
  },
});
