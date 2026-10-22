import { palette } from "@/theme/colors";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LoadedItemInfo } from "../SavedItemsControl";

type Props = {
  step: number;
  heading: string;
  prompt: string;
  loadedItem: LoadedItemInfo | null;
  children: ReactNode;
};

export function PanelHeading({
  step,
  heading,
  prompt,
  loadedItem,
  children,
}: Props) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionHeadingMain}>
        <Text style={styles.step}>{step.toString().padStart(2, "0")}</Text>
        <View style={styles.headingContent}>
          <Text style={styles.h2}>
            {heading}
            {loadedItem && (
              <Text style={styles.loadedItemName}>
                {" "}
                — {loadedItem.name}
                {loadedItem.dirty ? " (edited)" : ""}
              </Text>
            )}
          </Text>
          <Text style={styles.p}>{prompt}</Text>
        </View>
      </View>
      {/* <SavedItemsControl
        type="construction"
        data={construction}
        defaultData={DEFAULT_RECORD.construction}
        onLoad={onChange}
        onLoadedItemChange={setLoadedItem}
      /> */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 15,
  },
  sectionHeadingMain: {
    flexDirection: "row",
    gap: 15,
    flex: 1,
  },
  headingContent: {
    flex: 1,
  },
  step: {
    fontFamily: "monospace",
    fontSize: 14,
    color: palette.orange,
    paddingTop: 8,
  },
  h2: {
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "400",
    color: "#24231f",
    marginBottom: 6,
  },
  loadedItemName: {
    fontWeight: "400",
    fontSize: 13,
    color: palette.muted,
  },
  p: {
    color: "#77746b",
    fontSize: 13,
    lineHeight: 18,
  },
});
