import { ConfigListPage } from "@/components/config/ConfigListPage";
import { YarnProfile } from "@/lib/domain";
import { describeYarnProfile } from "@/lib/library";

export default function YarnProfilesPage() {
  return (
    <ConfigListPage<YarnProfile>
      type="yarnProfile"
      title="Yarn profiles"
      basePath="/config/yarn-profiles"
      emptyMessage="No yarn profiles saved yet. Save one from the calculator."
      summarize={describeYarnProfile}
    />
  );
}
