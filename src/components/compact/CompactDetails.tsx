import type { DetailRow } from "@/src/lib/compactDetails";

export function CompactDetails({ rows }: { rows: DetailRow[] }) {
  return (
    <details className="compact-details">
      <summary>Details</summary>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
