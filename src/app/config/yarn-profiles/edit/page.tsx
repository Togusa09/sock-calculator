"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ConfigEditPage } from "@/src/components/config/ConfigEditPage";
import { YarnProfileForm } from "@/src/components/config/YarnProfileForm";
import type { YarnProfile } from "@/src/lib/domain";
import { validateYarnProfile } from "@/src/lib/validation";

function EditYarnProfile() {
  const id = useSearchParams().get("id") ?? "";

  return (
    <ConfigEditPage<YarnProfile>
      type="yarnProfile"
      id={id}
      entityLabel="Yarn profile"
      indexHref="/config/yarn-profiles"
      indexLabel="Go to yarn profiles"
      validate={validateYarnProfile}
      renderFields={(data, onChange) => (
        <YarnProfileForm profile={data} onChange={onChange} />
      )}
    />
  );
}

export default function EditYarnProfilePage() {
  return (
    <Suspense>
      <EditYarnProfile />
    </Suspense>
  );
}
