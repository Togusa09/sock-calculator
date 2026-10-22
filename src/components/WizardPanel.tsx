import { WizardNav } from "@/components/WizardNav";
import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

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
  active,
  desktopActive,
  onBack,
  onNext,
  nextLabel,
  children,
}: Props) {
  const isVisible = active || desktopActive;

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.wizardPanel}>
      {children}
      <WizardNav onBack={onBack} onNext={onNext} nextLabel={nextLabel} />
    </View>
  );
}

const styles = StyleSheet.create({
  wizardPanel: {
    display: "flex",
  },
});
