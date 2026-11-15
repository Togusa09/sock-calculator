import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
});

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
