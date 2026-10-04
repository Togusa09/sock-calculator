"use client";

import { ConfigListPage } from "@/src/components/config/ConfigListPage";
import type { Measurements } from "@/src/lib/domain";

export default function FootSizesPage() {
  return (
    <ConfigListPage<Measurements>
      type="measurements"
      title="Foot sizes"
      basePath="/config/foot-sizes"
      emptyMessage="No foot sizes saved yet. Save one from the calculator."
      summarize={(m) =>
        `Length ${m.footLengthCm} cm · Ball circumference ${m.footCircumferenceCm} cm`
      }
    />
  );
}
