"use client";

import type { DisplayUnit } from "@/lib/domain";
import type { calculateStitches } from "@/lib/calculations";
import { formatMeasurement } from "@/lib/units";

type CalculationResult = ReturnType<typeof calculateStitches>;

type Props = {
  result: CalculationResult;
  unit: DisplayUnit;
  validation: string[];
};

function ResultMetric({
  label,
  value,
  unit,
  source,
}: {
  label: string;
  value: number;
  unit: DisplayUnit;
  source?: "entered" | "calculated";
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{formatMeasurement(value, unit)}</strong>
      {source === "calculated" && <em>calculated</em>}
    </div>
  );
}

export function ResultsPanel({ result, unit, validation }: Props) {
  const derived = result.derived;
  return (
    <aside className="results-column">
      <div className="results-header">
        <div>
          <p className="eyebrow">YOUR WORKING NUMBERS</p>
          <h2>Stitch plan</h2>
        </div>
        <span className="live-dot">Live</span>
      </div>
      {validation.length > 0 && (
        <div className="error-box" role="alert">
          {validation[0]}
        </div>
      )}
      <div className="hero-result">
        <span>Target foot circumference</span>
        <strong>{formatMeasurement(result.easedCircumferenceCm, unit)}</strong>
        <small>
          {result.easePercent}% negative ease applied to{" "}
          {formatMeasurement(result.targetCircumferenceCm, unit)}
        </small>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span>Base stitches</span>
          <strong>{result.baseStitches.toFixed(1)}</strong>
        </div>
        <div className="metric accent">
          <span>Rounded stitches</span>
          <strong>{result.roundedStitches}</strong>
          <small>repeat-constrained</small>
        </div>
      </div>
      <div className="derived-list">
        <ResultMetric
          label="Ankle"
          value={derived.ankleCircumference.value}
          unit={unit}
          source={derived.ankleCircumference.source}
        />
        <ResultMetric
          label="Heel height"
          value={derived.heelHeight.value}
          unit={unit}
          source={derived.heelHeight.source}
        />
        <ResultMetric
          label="Toe length"
          value={derived.toeLength.value}
          unit={unit}
          source={derived.toeLength.source}
        />
      </div>
      <div className="section-results">
        <h3>Section counts</h3>
        <div className="result-row">
          <span>
            Cuff <small>{result.sections.cuff.detail}</small>
          </span>
          <strong>{result.sections.cuff.stitches} sts</strong>
        </div>
        <div className="result-row">
          <span>
            Leg{" "}
            <small>
              {formatMeasurement(result.sections.leg.lengthCm, unit)} working
              length
            </small>
          </span>
          <strong>{result.sections.leg.stitches} sts</strong>
        </div>
        <div className="result-row">
          <span>
            Heel <small>{result.sections.heel.detail}</small>
          </span>
          <strong>{result.sections.heel.stitches} sts</strong>
        </div>
        <div className="result-row">
          <span>
            Foot{" "}
            <small>
              {formatMeasurement(result.sections.foot.lengthCm, unit)} working
              length
            </small>
          </span>
          <strong>{result.sections.foot.stitches} sts</strong>
        </div>
        <div className="result-row">
          <span>
            Toe <small>{result.sections.toe.detail}</small>
          </span>
          <strong>{result.sections.toe.finalStitches} sts</strong>
        </div>
      </div>
      <div className="diagram">
        <svg
          viewBox="0 0 467 168"
          role="img"
          aria-labelledby="foot-guide-title foot-guide-description"
        >
          <title id="foot-guide-title">Foot measurement guide</title>
          <desc id="foot-guide-description">
            A foot outline with callouts for heel diagonal, ball circumference,
            and foot length.
          </desc>
          <g className="diagram-callouts">
            <line x1="19" y1="72" x2="38" y2="72" />
            <text x="46" y="76">
              heel diagonal
            </text>
            <line x1="330" y1="92" x2="349" y2="92" />
            <text x="357" y="96">
              ball circumference
            </text>
            <line x1="365" y1="24" x2="385" y2="24" />
            <text x="393" y="28">
              foot length
            </text>
          </g>
          <path
            className="diagram-outline"
            d="M222 25c-19 0-31 18-32 43-1 24 8 54 26 60 19 6 42-5 48-25 6-20-2-54-17-68-8-7-16-10-25-10Z"
          />
          <text
            className="diagram-word"
            x="227"
            y="84"
            textAnchor="middle"
            transform="rotate(-12 227 84)"
          >
            FOOT
          </text>
        </svg>
      </div>
    </aside>
  );
}
