import sharedStyles from "@/theme/styles";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface LabeledFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  testID?: string;
  children: ReactNode;
}

export default function LabeledField({
  label,
  required,
  error,
  testID,
  children,
}: LabeledFieldProps) {
  return (
    <View style={styles.wrapper} testID={testID}>
      <View style={styles.container}>
        {!!label && (
          <Text style={[sharedStyles.label, sharedStyles.formLabel]}>
            {label}
            {required && (
              <Text style={styles.asterisk} aria-hidden>
                *
              </Text>
            )}
          </Text>
        )}
        {children}
      </View>
      {!!error && (
        <Text style={styles.error} role="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

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
    sharedStyles.formControl,
    hasError && fieldControlStyles.error,
  ];
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  asterisk: {
    color: "#ff4d4f",
  },
  error: {
    color: "#ff4d4f",
    marginTop: 4,
  },
});
