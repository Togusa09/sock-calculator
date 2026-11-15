import { styles as sharedStyles } from "@/theme/styles";
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
          <Text
            style={[sharedStyles.label, sharedStyles.formLabel]}
            accessibilityRole="label"
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
  asterisk: {
    color: "#ff4d4f",
  },
  error: {
    color: "#ff4d4f",
    marginTop: 4,
  },
});
