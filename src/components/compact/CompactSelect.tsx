"use client";

import { CompactDetails } from "@/src/components/compact/CompactDetails";
import type { DetailRow } from "@/src/lib/compactDetails";

type Option = { id: string; label: string };

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  details?: DetailRow[];
};

export function CompactSelect({
  label,
  options,
  value,
  onChange,
  details,
}: Props) {
  return (
    <div className="compact-item">
      <label className="compact-field">
        <span>{label}</span>
        <select
          value={value}
          disabled={options.length === 0}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">
            {options.length === 0 ? "None saved" : "Select…"}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {details && <CompactDetails rows={details} />}
    </div>
  );
}
