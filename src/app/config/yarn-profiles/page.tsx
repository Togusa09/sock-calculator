"use client";

import { ConfigListPage } from "@/src/components/config/ConfigListPage";
import type { YarnProfile } from "@/src/lib/domain";
import { describeYarnProfile } from "@/src/lib/library";

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
