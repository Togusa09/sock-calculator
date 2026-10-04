"use client";

import { useState } from "react";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/src/components/SavedItemsControl";
import {
  DEFAULT_RECORD,
  type Measurements,
  type DisplayUnit,
} from "@/src/lib/domain";
import { NumberField } from "@/src/components/NumberField";

type Props = {
  measurements: Measurements;
  unit: DisplayUnit;
  onChange: (update: Partial<Measurements>) => void;
};

export function FootMeasurements({ measurements, unit, onChange }: Props) {
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  return (
    <section className="panel">
      <div className="section-heading">
        <div className="section-heading-main">
          <span className="step">01</span>
          <div>
            <h2>
              Foot measurements
              {loadedItem && (
                <span className="loaded-item-name">
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </span>
              )}
            </h2>
            <p>Two measurements are enough to begin.</p>
          </div>
        </div>
        <SavedItemsControl
          type="measurements"
          data={measurements}
          defaultData={DEFAULT_RECORD.measurements}
          onLoad={onChange}
          onLoadedItemChange={setLoadedItem}
        />
      </div>
      <div className="field-grid">
        <NumberField
          label="Foot length"
          value={measurements.footLengthCm}
          unit={unit}
          required
          onChange={(value) => onChange({ footLengthCm: value ?? 0 })}
        />
        <NumberField
          label="Ball circumference"
          value={measurements.footCircumferenceCm}
          unit={unit}
          required
          onChange={(value) => onChange({ footCircumferenceCm: value ?? 0 })}
        />
      </div>
      <details>
        <summary>More measurements</summary>
        <div className="field-grid">
          <NumberField
            label="Heel diagonal"
            value={measurements.heelDiagonalCm}
            unit={unit}
            onChange={(value) => onChange({ heelDiagonalCm: value })}
          />
          <NumberField
            label="Ankle circumference"
            value={measurements.ankleCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ ankleCircumferenceCm: value })}
          />
          <NumberField
            label="Heel height"
            value={measurements.heelHeightCm}
            unit={unit}
            onChange={(value) => onChange({ heelHeightCm: value })}
          />
          <NumberField
            label="Instep circumference"
            value={measurements.instepCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ instepCircumferenceCm: value })}
          />
          <NumberField
            label="Toe length"
            value={measurements.toeLengthCm}
            unit={unit}
            onChange={(value) => onChange({ toeLengthCm: value })}
          />
          <NumberField
            label="Low calf circumference"
            value={measurements.lowCalfCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ lowCalfCircumferenceCm: value })}
          />
          <NumberField
            label="High calf circumference"
            value={measurements.highCalfCircumferenceCm}
            unit={unit}
            onChange={(value) => onChange({ highCalfCircumferenceCm: value })}
          />
        </div>
      </details>
    </section>
  );
}
