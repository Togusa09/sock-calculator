import { StyleSheet } from "react-native";

const gap = 8;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    gap,
    paddingTop: gap,
    paddingBottom: gap,
  },
  column: {
    flexDirection: "column",
    width: "100%",
    gap,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  leftAligned: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "left",
  },
  rightAligned: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    textAlign: "right",
  },
  container: {
    // flex: 1,
    padding: gap,
  },
  bordered: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
    fontWeight: "500",
  },
  formLabel: {
    minWidth: 180,
  },
  formControl: {
    minWidth: 220,
  },
  error: {
    color: "#ff4d4f",
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  heading1: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  heading2: {
    fontSize: 18,
    marginBottom: 14,
    textAlign: "center",
    color: "#333",
  },
});

export { styles as sharedStyles };

export const fieldControlStyles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  error: {
    borderColor: "#ff4d4f",
    backgroundColor: "#fffbfe",
  },
});

export function fieldControlStyle(hasError?: boolean) {
  return [
    fieldControlStyles.base,
    styles.formControl,
    hasError && fieldControlStyles.error,
  ];
}
