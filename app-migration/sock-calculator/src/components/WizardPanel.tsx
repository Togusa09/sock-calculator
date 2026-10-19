import { palette } from "@/theme/colors";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { WizardNav } from "./WizardNav";

type Props = {
  id: string;
  active: boolean;
  desktopActive: boolean;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  children: ReactNode;
};

export function WizardPanel({
  id,
  active,
  desktopActive,
  onBack,
  onNext,
  nextLabel,
  children,
}: Props) {
  return (
    <View
      style={[
        styles.wizardPanel,
        active ? styles.panelVisble : styles.panelHidden,
      ]}
      testID={`wizard-panel-${id}`}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children}
        <WizardNav onBack={onBack} onNext={onNext} nextLabel={nextLabel} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wizardPanel: {
    flex: 1,
    backgroundColor: palette.panel,
  },
  panelVisble: {
    display: "contents",
  },
  panelHidden: {
    display: "none",
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
});
