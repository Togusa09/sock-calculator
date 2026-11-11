// import { PickerInputProps } from "react-native";

import sharedStyles from "@/theme/styles";
import { Picker, PickerProps } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

// interface Props extends PickerInputProps {
//   label: string;
//   value: string;
//   required?: boolean;
//   //   onChange: (value: string) => void;
// }

interface Props extends PickerProps {
  label: string;
  value: string;
  required?: boolean;
  //   onChange: (value: string) => void;
}

export default function LabeledPicker({
  label,
  required,
  selectedValue,
  children,
  ...rest
}: Props) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[sharedStyles.label, sharedStyles.formLabel]}>
          {label}
          {required && <Text style={styles.asterisk}>*</Text>}
        </Text>
      )}
      <Picker
        selectedValue={selectedValue}
        style={[styles.baseInput, sharedStyles.formControl]}
        onValueChange={(value, index) => rest.onValueChange?.(value, index)}
        {...rest}
      >
        {children}
      </Picker>
    </View>

    // <View testID="yarn-weight-field">
    //   <Text>Weight</Text>
    //   <PlatformPicker
    //     flush
    //     selectedValue={profile.weight}
    //     onValueChange={(weight) =>
    //       onChange({ weight: weight as YarnWeightUnit })
    //     }
    //     items={[
    //       { label: "Fingering", value: "fingering" },
    //       { label: "DK", value: "DK" },
    //       { label: "Worsted", value: "worsted" },
    //     ]}
    //   />
    // </View>
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
