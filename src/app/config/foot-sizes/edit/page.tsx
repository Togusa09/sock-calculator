"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ConfigEditPage } from "@/src/components/config/ConfigEditPage";
import { FootSizeForm } from "@/src/components/config/FootSizeForm";
import type { Measurements } from "@/src/lib/domain";
import { validateMeasurements } from "@/src/lib/validation";

function EditFootSize() {
  const id = useSearchParams().get("id") ?? "";

  return (
    <ConfigEditPage<Measurements>
      type="measurements"
      id={id}
      entityLabel="Foot size"
      indexHref="/config/foot-sizes"
      indexLabel="Go to foot sizes"
      validate={validateMeasurements}
      renderFields={(data, onChange) => (
        <FootSizeForm measurements={data} onChange={onChange} />
      )}
    />
  );
}

export default function EditFootSizePage() {
  return (
    <Suspense>
      <EditFootSize />
    </Suspense>
  );
}
