"use client";

import { Suspense } from "react";
import { ConfigEditPage } from "@/components/config/ConfigEditPage";
import { YarnProfileForm } from "@/components/config/YarnProfileForm";
import type { YarnProfile } from "@/lib/domain";
import { validateYarnProfile } from "@/lib/validation";

function EditYarnProfile() {
  // const id = useSearchParams().get("id") ?? "";
  const id = "";

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
