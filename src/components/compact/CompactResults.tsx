"use client";

import type { calculateStitches } from "@/src/lib/calculations";
import { formatMeasurement } from "@/src/lib/units";

type Props = {
  result: ReturnType<typeof calculateStitches>;
  errors: string[];
};

export function CompactResults({ result, errors }: Props) {
  const { sections } = result;
  const rows: [string, string][] = [
    ["Cuff", `${sections.cuff.stitches} sts`],
    ["Leg", `${sections.leg.stitches} sts`],
    ["Heel", `${sections.heel.stitches} sts`],
    ["Foot", `${sections.foot.stitches} sts`],
    ["Toe", `${sections.toe.finalStitches} sts`],
  ];
  return (
    <section className="compact-results" aria-label="Results">
      {errors.length > 0 && (
        <p className="error-box" role="alert">
          {errors[0]}
        </p>
      )}
      <p className="compact-hero">
        <strong>{result.roundedStitches}</strong> sts cast on
        <small>
          {" "}
          for {formatMeasurement(result.easedCircumferenceCm, "metric")}
        </small>
      </p>
      <dl>
        {rows.map(([name, value]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
