import type { DisplayUnit } from "@/lib/domain";
import { measurementLabel } from "@/lib/units";
import LabeledField, { LabeledFieldProps } from "./LabeledField";

export interface LabeledUnitFieldProps extends LabeledFieldProps {
  unit: DisplayUnit;
}

export default function LabeledUnitField({
  label,
  unit,
  ...rest
}: LabeledUnitFieldProps) {
  const unitLabel = measurementLabel(unit);
  return (
    <LabeledField
      label={label ? `${label} (${unitLabel})` : `(${unitLabel})`}
      responsive
      {...rest}
    />
  );
}
