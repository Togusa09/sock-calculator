"use client";

import { useState } from "react";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import { DEFAULT_RECORD, type YarnTension } from "@/lib/domain";

type Props = {
  tension: YarnTension;
  onChange: (update: Partial<YarnTension>) => void;
};

export function YarnTension({ tension, onChange }: Props) {
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  return (
    <section className="panel">
      <div className="section-heading">
        <div className="section-heading-main">
          <span className="step">02</span>
          <div>
            <h2>
              Yarn tension
              {loadedItem && (
                <span className="loaded-item-name">
                  {" "}
                  — {loadedItem.name}
                  {loadedItem.dirty ? " (edited)" : ""}
                </span>
              )}
            </h2>
            <p>Gauge and ease shape the fit.</p>
          </div>
        </div>
        <SavedItemsControl
          type="tension"
          data={tension}
          defaultData={DEFAULT_RECORD.tension}
          onLoad={onChange}
          onLoadedItemChange={setLoadedItem}
        />
      </div>
      <div className="field-grid">
        <label className="field">
          <span>Stitches per 10 cm *</span>
          <input
            type="number"
            min="1"
            step="0.5"
            value={tension.stitchesPer10Cm}
            onChange={(event) =>
              onChange({ stitchesPer10Cm: Number(event.target.value) })
            }
          />
          <small>sts</small>
        </label>
        <label className="field">
          <span>Rows per 10 cm *</span>
          <input
            type="number"
            min="1"
            step="0.5"
            value={tension.rowsPer10Cm}
            onChange={(event) =>
              onChange({ rowsPer10Cm: Number(event.target.value) })
            }
          />
          <small>rows</small>
        </label>
        <label className="field">
          <span>Needle size</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={tension.needleSizeMm}
            onChange={(event) =>
              onChange({ needleSizeMm: Number(event.target.value) })
            }
          />
          <small>mm</small>
        </label>
        <label className="field">
          <span>Negative ease</span>
          <input
            type="number"
            min="0"
            max="99"
            step="1"
            value={tension.negativeEasePercent}
            onChange={(event) =>
              onChange({ negativeEasePercent: Number(event.target.value) })
            }
          />
          <small>%</small>
        </label>
      </div>
      <p className="hint">
        A swatch under 10 cm can be less accurate. The gauge above is stored in
        metric regardless of display unit.
      </p>
    </section>
  );
}
