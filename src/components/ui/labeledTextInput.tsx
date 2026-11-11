import { TextInput, TextInputProps } from "react-native";
import LabeledField, { fieldControlStyle } from "./LabeledField";

interface Props extends TextInputProps {
  label: string;
  value: string;
  required?: boolean;
  error?: string;
}

export default function LabeledTextInput({
  label,
  required,
  error,
  style,
  ...rest
}: Props) {
  return (
    <LabeledField label={label} required={required} error={error}>
      <TextInput
        style={[fieldControlStyle(!!error), style]}
        accessibilityLabel={label}
        {...rest}
        aria-required={required}
      />
    </LabeledField>
  );
}
