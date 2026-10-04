"use client";

import type { MaterialComponent } from "@/src/lib/domain";

type Props = {
  materials: MaterialComponent[];
  onChange: (materials: MaterialComponent[]) => void;
};

export function MaterialMixEditor({ materials, onChange }: Props) {
  const total = materials.reduce((sum, item) => sum + item.percent, 0);

  function updateRow(index: number, update: Partial<MaterialComponent>) {
    onChange(
      materials.map((item, i) => (i === index ? { ...item, ...update } : item)),
    );
  }

  return (
    <div className="material-mix">
      {materials.map((item, index) => (
        <div className="field-grid" key={index}>
          <label className="field">
            <span>Material</span>
            <input
              type="text"
              value={item.material}
              onChange={(event) =>
                updateRow(index, { material: event.target.value })
              }
            />
          </label>
          <label className="field">
            <span>Percent</span>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={item.percent}
              onChange={(event) =>
                updateRow(index, { percent: Number(event.target.value) })
              }
            />
            <small>%</small>
          </label>
          {materials.length > 1 && (
            <button
              type="button"
              className="button reset"
              onClick={() => onChange(materials.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="button secondary"
        onClick={() => onChange([...materials, { material: "", percent: 0 }])}
      >
        Add material
      </button>
      <p className="hint">
        Total: {total}%{total !== 100 ? " — must add up to 100%." : ""}
      </p>
    </div>
  );
}
