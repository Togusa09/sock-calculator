import { styles as sharedStyles } from "@/theme/styles";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface LabeledFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  testID?: string;
  responsive?: boolean;
  children: ReactNode;
}

export default function LabeledField({
  label,
  required,
  error,
  testID,
  responsive,
  children,
}: LabeledFieldProps) {
  return (
    <View style={styles.wrapper} testID={testID}>
      <View
        style={[styles.container, responsive && styles.responsiveContainer]}
      >
        {!!label && (
          <Text
            style={[
              sharedStyles.label,
              sharedStyles.formLabel,
              responsive && styles.responsiveLabel,
            ]}
            accessibilityRole="text"
            accessibilityLabel={label}
          >
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

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  responsiveContainer: {
    flexWrap: "wrap",
  },
  responsiveLabel: {
    minWidth: 0,
    maxWidth: "100%",
    flexBasis: 180,
  },
  asterisk: {
    color: "#ff4d4f",
  },
  error: {
    color: "#ff4d4f",
    marginTop: 4,
  },
});
