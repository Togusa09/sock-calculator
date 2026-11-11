import { Picker, PickerProps } from "@react-native-picker/picker";
import LabeledField, { fieldControlStyle } from "./LabeledField";

interface Props extends PickerProps {
  label: string;
  required?: boolean;
  error?: string;
}

export default function LabeledPicker({
  label,
  required,
  error,
  style,
  children,
  ...rest
}: Props) {
  return (
    <LabeledField label={label} required={required} error={error}>
      <Picker
        accessibilityLabel={label}
        style={[fieldControlStyle(!!error), style]}
        {...rest}
      >
        {children}
      </Picker>
    </LabeledField>
  );
}
