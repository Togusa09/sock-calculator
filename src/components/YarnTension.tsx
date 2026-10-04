"use client";

import { useEffect, useState } from "react";
import {
  type SavedTension,
  type YarnProfile,
  type YarnTension,
} from "@/src/lib/domain";
import {
  describeYarnProfile,
  findTension,
  saveTension,
} from "@/src/lib/library";

type Props = {
  tension: YarnTension;
  yarnProfile: YarnProfile;
  yarnProfileId?: string;
  onChange: (update: Partial<YarnTension>) => void;
};

function toGauge(saved: SavedTension): YarnTension {
  const { yarnProfileId: _ignored, ...gauge } = saved;
  void _ignored;
  return gauge;
}

export function YarnTension({
  tension,
  yarnProfile,
  yarnProfileId,
  onChange,
}: Props) {
  const [status, setStatus] = useState("");
  const [lookupFound, setLookupFound] = useState(false);

  // Look up the saved tension whenever the selected yarn or needle size changes.
  useEffect(() => {
    const found = yarnProfileId
      ? findTension(yarnProfileId, tension.needleSizeMm)
      : undefined;
    // Syncing UI state with the external localStorage library.
    /* eslint-disable react-hooks/set-state-in-effect */
    setStatus("");
    setLookupFound(!!found);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (found) onChange(toGauge(found.data));
    // Only re-run on selection changes, not on gauge edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yarnProfileId, tension.needleSizeMm]);

  function handleSave() {
    if (!yarnProfileId) return;
    saveTension(
      yarnProfileId,
      tension,
      `${yarnProfile.manufacturer} ${yarnProfile.weight} @ ${tension.needleSizeMm} mm`,
    );
    setLookupFound(true);
    setStatus("Tension saved.");
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div className="section-heading-main">
          <span className="step">03</span>
          <div>
            <h2>Yarn tension</h2>
            <p>
              {yarnProfileId
                ? `${describeYarnProfile(yarnProfile)} — gauge and ease shape the fit.`
                : "Save a yarn profile to look up and store tensions."}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="button secondary"
          disabled={!yarnProfileId}
          onClick={handleSave}
        >
          Save for this yarn + needle
        </button>
      </div>
      {yarnProfileId && (
        <p className="hint" role="status">
          {status ||
            (lookupFound
              ? "Loaded saved tension for this yarn and needle size."
              : "No saved tension for this yarn and needle size yet; enter a gauge and save it.")}
        </p>
      )}{" "}
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
