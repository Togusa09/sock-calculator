"use client";

import { ConfigCreatePage } from "@/components/config/ConfigCreatePage";
import { FootSizeForm } from "@/components/config/FootSizeForm";
import { DEFAULT_RECORD, type Measurements } from "@/lib/domain";
import { validateMeasurements } from "@/lib/validation";

export default function NewFootSizePage() {
  return (
    <ConfigCreatePage<Measurements>
      type="measurements"
      entityLabel="Foot size"
      indexHref="/config/foot-sizes"
      defaultData={DEFAULT_RECORD.measurements}
      validate={validateMeasurements}
      renderFields={(data, onChange) => (
        <FootSizeForm measurements={data} onChange={onChange} />
      )}
    />
  );
}
