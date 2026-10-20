import { ConfigCreatePage } from "@/components/config/ConfigCreatePage";
import { YarnProfileForm } from "@/components/config/YarnProfileForm";
import { DEFAULT_YARN_PROFILE, type YarnProfile } from "@/lib/domain";
import { validateYarnProfile } from "@/lib/validation";

export default function NewYarnProfilePage() {
  return (
    <ConfigCreatePage<YarnProfile>
      type="yarnProfile"
      entityLabel="Yarn profile"
      indexHref="/config/yarn-profiles"
      defaultData={DEFAULT_YARN_PROFILE}
      validate={validateYarnProfile}
      renderFields={(data, onChange) => (
        <YarnProfileForm profile={data} onChange={onChange} />
      )}
    />
  );
}
