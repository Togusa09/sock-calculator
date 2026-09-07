"use client";

import type {
  ConstructionOptions,
  CuffStyle,
  HeelStyle,
  Ribbing,
  ToeStyle,
} from "@/lib/domain";

type Props = {
  construction: ConstructionOptions;
  tensionNegativeEase: number;
  onChange: (update: Partial<ConstructionOptions>) => void;
};

export function Construction({
  construction,
  tensionNegativeEase,
  onChange,
}: Props) {
  return (
    <section className="panel">
      <div className="section-heading">
        <span className="step">03</span>
        <div>
          <h2>Construction</h2>
          <p>Choose the shape you plan to knit.</p>
        </div>
      </div>
      <div className="construction-fields">
        <div className="construction-row">
          <label className="field">
            <span>Cuff</span>
            <select
              value={construction.cuffStyle}
              onChange={(event) =>
                onChange({ cuffStyle: event.target.value as CuffStyle })
              }
            >
              <option value="ribbed">Ribbed cuff</option>
              <option value="folded">Folded cuff</option>
            </select>
          </label>
          {construction.cuffStyle === "ribbed" && (
            <label className="field">
              <span>Ribbing repeat</span>
              <select
                value={construction.ribbing}
                onChange={(event) =>
                  onChange({ ribbing: event.target.value as Ribbing })
                }
              >
                <option>1x1</option>
                <option>1x2</option>
                <option>2x2</option>
                <option>3x3</option>
              </select>
            </label>
          )}
        </div>
        <label className="field">
          <span>Heel</span>
          <select
            value={construction.heelStyle}
            onChange={(event) =>
              onChange({ heelStyle: event.target.value as HeelStyle })
            }
          >
            <option value="gussetted">Gussetted</option>
            <option value="afterthought">Afterthought</option>
            <option value="short-row">Short-row</option>
          </select>
        </label>
        <label className="field">
          <span>Toe</span>
          <select
            value={construction.toeStyle}
            onChange={(event) =>
              onChange({ toeStyle: event.target.value as ToeStyle })
            }
          >
            <option value="round">Round</option>
            <option value="star">Star</option>
          </select>
        </label>
      </div>
      <label className="override">
        <input
          type="checkbox"
          checked={construction.negativeEasePercent !== undefined}
          onChange={(event) =>
            onChange({
              negativeEasePercent: event.target.checked
                ? tensionNegativeEase
                : undefined,
            })
          }
        />{" "}
        Override project ease
      </label>
      {construction.negativeEasePercent !== undefined && (
        <label className="field compact">
          <span>Project negative ease</span>
          <input
            type="number"
            min="0"
            max="99"
            value={construction.negativeEasePercent}
            onChange={(event) =>
              onChange({ negativeEasePercent: Number(event.target.value) })
            }
          />
          <small>%</small>
        </label>
      )}
    </section>
  );
}
