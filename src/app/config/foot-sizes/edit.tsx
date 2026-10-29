import { ConfigEditPage } from "@/components/config/ConfigEditPage";
import { FootSizeForm } from "@/components/config/FootSizeForm";
import type { Measurements } from "@/lib/domain";
import { validateMeasurements } from "@/lib/validation";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";

function EditFootSize() {
  const { id } = useLocalSearchParams<{ id: string }>();

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
