"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ConfigNotFound,
  ConfigShell,
} from "@/src/components/config/ConfigShell";
import { useLibraryItem } from "@/src/hooks/UseLibraryItems";
import {
  isNameTaken,
  updateItem,
  type LibraryItem,
  type LibraryItemType,
} from "@/src/lib/library";

type Props<T> = {
  type: LibraryItemType;
  id: string;
  entityLabel: string;
  indexHref: string;
  indexLabel: string;
  validate: (data: T) => string[];
  renderFields: (data: T, onChange: (data: T) => void) => ReactNode;
};

export function ConfigEditPage<T>({
  type,
  id,
  entityLabel,
  indexHref,
  indexLabel,
  validate,
  renderFields,
}: Props<T>) {
  const state = useLibraryItem<T>(type, id);

  return (
    <ConfigShell title={`Edit ${entityLabel.toLowerCase()}`}>
      {state.status === "loading" && (
        <section className="panel">
          <p>Loading…</p>
        </section>
      )}
      {state.status === "notFound" && (
        <ConfigNotFound
          entityLabel={entityLabel}
          indexHref={indexHref}
          indexLabel={indexLabel}
        />
      )}
      {state.status === "ready" && (
        <ConfigEditor
          type={type}
          item={state.item}
          indexHref={indexHref}
          validate={validate}
          renderFields={renderFields}
        />
      )}
    </ConfigShell>
  );
}

type EditorProps<T> = Pick<
  Props<T>,
  "type" | "indexHref" | "validate" | "renderFields"
> & { item: LibraryItem<T> };

function ConfigEditor<T>({
  type,
  item,
  indexHref,
  validate,
  renderFields,
}: EditorProps<T>) {
  const [name, setName] = useState(item.name);
  const [data, setData] = useState<T>(item.data);
  const [saved, setSaved] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const errors = [
    ...(name.trim() ? [] : ["Name is required."]),
    ...(name.trim() && isNameTaken(type, name, item.id)
      ? ["Another item already uses that name."]
      : []),
    ...validate(data),
  ];

  function handleSave() {
    setShowErrors(true);
    if (errors.length > 0) return;
    updateItem(type, item.id, name, data);
    setSaved(true);
  }

  function changeName(value: string) {
    setSaved(false);
    setName(value);
  }

  function changeData(value: T) {
    setSaved(false);
    setData(value);
  }

  return (
    <section className="panel">
      <label className="field">
        <span>Name *</span>
        <input
          type="text"
          value={name}
          onChange={(event) => changeName(event.target.value)}
        />
      </label>
      {renderFields(data, changeData)}
      {showErrors && errors.length > 0 && (
        <p className="error-box" role="alert">
          {errors[0]}
        </p>
      )}
      {saved && (
        <p className="notice" role="status">
          Saved.
        </p>
      )}
      <div className="top-actions">
        <button className="button secondary" onClick={handleSave}>
          Save
        </button>
        <Link className="button reset" href={indexHref}>
          Back to list
        </Link>
      </div>
    </section>
  );
}
