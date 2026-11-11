import sharedStyles from "@/theme/styles";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface Props extends TextInputProps {
  label: string;
  value: string;
  required?: boolean;
  //   onChange: (value: string) => void;
}

export default function LabeledTextInput({ label, required, ...rest }: Props) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[sharedStyles.label, sharedStyles.formLabel]}>
          {label}
          {required && <Text style={styles.asterisk}>*</Text>}
        </Text>
      )}
      <TextInput
        style={[styles.baseInput, sharedStyles.formControl]}
        {...rest}
        aria-required={required}
        accessibilityLabel={required ? "Required field" : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  asterisk: {
    color: "#ff4d4f", // Clean alert red
  },
  baseInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "#ff4d4f",
    backgroundColor: "#fffbfe",
  },
});
