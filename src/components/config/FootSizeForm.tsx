"use client";

import { useState } from "react";
import { NumberField } from "@/src/components/NumberField";
import type { DisplayUnit, Measurements } from "@/src/lib/domain";

type Props = {
  measurements: Measurements;
  onChange: (measurements: Measurements) => void;
};

type FieldDefinition = {
  key: keyof Measurements;
  label: string;
  required?: boolean;
};

const FIELDS: FieldDefinition[] = [
  { key: "footLengthCm", label: "Foot length", required: true },
  { key: "footCircumferenceCm", label: "Ball circumference", required: true },
  { key: "heelDiagonalCm", label: "Heel diagonal" },
  { key: "ankleCircumferenceCm", label: "Ankle circumference" },
  { key: "heelHeightCm", label: "Heel height" },
  { key: "instepCircumferenceCm", label: "Instep circumference" },
  { key: "toeLengthCm", label: "Toe length" },
  { key: "lowCalfCircumferenceCm", label: "Low calf circumference" },
  { key: "highCalfCircumferenceCm", label: "High calf circumference" },
];

export function FootSizeForm({ measurements, onChange }: Props) {
  const [unit, setUnit] = useState<DisplayUnit>("metric");

  return (
    <>
      <label className="unit-toggle">
        Display{" "}
        <select
          value={unit}
          onChange={(event) => setUnit(event.target.value as DisplayUnit)}
        >
          <option value="metric">Metric</option>
          <option value="imperial">Imperial</option>
        </select>
      </label>
      <div className="field-grid">
        {FIELDS.map(({ key, label, required }) => (
          <NumberField
            key={key}
            label={label}
            required={required}
            unit={unit}
            value={measurements[key]}
            onChange={(value) =>
              onChange({
                ...measurements,
                [key]: required ? (value ?? 0) : value,
              })
            }
          />
        ))}
      </div>
    </>
  );
}
