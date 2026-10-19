"use client";

import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { ConfigEditor } from "@/components/config/ConfigEditPage";
import { ConfigShell } from "@/components/config/ConfigShell";
import { saveItem, type LibraryItemType } from "@/lib/library";

type Props<T> = {
  type: LibraryItemType;
  entityLabel: string;
  indexHref: string;
  defaultData: T;
  validate: (data: T) => string[];
  renderFields: (data: T, onChange: (data: T) => void) => ReactNode;
};

export function ConfigCreatePage<T>({
  type,
  entityLabel,
  indexHref,
  defaultData,
  validate,
  renderFields,
}: Props<T>) {
  const router = useRouter();

  return (
    <ConfigShell title={`New ${entityLabel.toLowerCase()}`}>
      <ConfigEditor<T>
        type={type}
        initialName=""
        initialData={defaultData}
        indexHref={indexHref}
        validate={validate}
        renderFields={renderFields}
        onSave={(name, data) => {
          saveItem(type, data, name);
          router.push(indexHref);
        }}
      />
    </ConfigShell>
  );
}
