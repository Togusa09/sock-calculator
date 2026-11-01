import { palette } from "@/theme/colors";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

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
  const isCompact = useWindowDimensions().width <= 850;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.wizardTabs, isCompact && styles.wizardTabsCompact]}
      contentContainerStyle={
        isCompact ? styles.wizardTabsCompactContent : undefined
      }
      testID="wizard-tabs"
      accessibilityRole="tablist"
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <TouchableOpacity
            key={tab.id}
            testID={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[
              styles.wizardTab,
              isCompact && styles.wizardTabCompact,
              selected && styles.isActive,
              !isCompact && tab.mobileOnly && styles.mobileOnly,
            ]}
            onPress={() => onSelect(tab.id)}
          >
            <Text style={styles.wizardTabStep}>{tab.step}</Text>
            <Text
              numberOfLines={isCompact ? 1 : undefined}
              style={[
                styles.wizardTabLabel,
                isCompact && styles.wizardTabLabelCompact,
                selected && styles.isActiveLabel,
              ]}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wizardTabs: {
    width: 140,
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: "column",
    gap: 6,
  },
  wizardTabsCompact: {
    width: "100%",
    flexGrow: 0,
  },
  wizardTabsCompactContent: {
    flexDirection: "row",
    gap: 4,
  },
  wizardTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
  },
  wizardTabCompact: {
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  wizardTabLabelCompact: {
    fontSize: 11,
    textAlign: "center",
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
