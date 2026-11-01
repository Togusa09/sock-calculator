import { palette } from "@/theme/colors";
import { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

type Props = {
  children: ReactNode;
};

export function Panel({ children }: Props) {
  const isNarrow = useWindowDimensions().width <= 500;
  return (
    <View style={[styles.panel, isNarrow && styles.panelNarrow]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 27,
    borderRadius: 2,
  },
  panelNarrow: {
    padding: 20,
  },
});
