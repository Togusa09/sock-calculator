import { palette } from "@/theme/colors";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: ReactNode;
};

export function Panel({ children }: Props) {
  return <View style={styles.panel}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 27,
    borderRadius: 2,
  },
});
