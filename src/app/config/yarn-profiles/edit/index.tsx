import { ConfigEditPage } from "@/components/config/ConfigEditPage";
import { YarnProfileForm } from "@/components/config/YarnProfileForm";
import type { YarnProfile } from "@/lib/domain";
import { validateYarnProfile } from "@/lib/validation";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";

function EditYarnProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();

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
