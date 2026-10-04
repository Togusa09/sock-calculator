"use client";

import type { DisplayUnit } from "@/src/lib/domain";
import {
  fromCentimetres,
  measurementLabel,
  toCentimetres,
} from "@/src/lib/units";

type Props = {
  label: string;
  value: number | undefined;
  unit: DisplayUnit;
  onChange: (value: number | undefined) => void;
  required?: boolean;
};

export function NumberField({
  label,
  value,
  unit,
  onChange,
  required = false,
}: Props) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type="number"
        min="0"
        step="0.1"
        value={
          value === undefined
            ? ""
            : Number(fromCentimetres(value, unit).toFixed(2))
        }
        onChange={(event) =>
          onChange(
            event.target.value === ""
              ? undefined
              : toCentimetres(Number(event.target.value), unit),
          )
        }
      />
      <small>{measurementLabel(unit)}</small>
    </label>
  );
}
