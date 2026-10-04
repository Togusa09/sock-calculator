"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ConfigShell } from "@/src/components/config/ConfigShell";
import { useLibraryItems } from "@/src/hooks/UseLibraryItems";
import type { LibraryItem, LibraryItemType } from "@/src/lib/library";

type Props<T> = {
  type: LibraryItemType;
  title: string;
  basePath: string;
  emptyMessage: string;
  summarize: (data: T) => ReactNode;
};

export function ConfigListPage<T>({
  type,
  title,
  basePath,
  emptyMessage,
  summarize,
}: Props<T>) {
  const state = useLibraryItems<T>(type);

  return (
    <ConfigShell title={title}>
      <div className="list-actions">
        <Link className="button" href={`${basePath}/new`}>
          Create new
        </Link>
      </div>
      <section className="panel">
        {state.status === "loading" && <p>Loading…</p>}
        {state.status === "ready" && state.items.length === 0 && (
          <p className="saved-items-empty">{emptyMessage}</p>
        )}
        {state.status === "ready" && state.items.length > 0 && (
          <ul className="config-list">
            {sortByName(state.items).map((item) => (
              <li key={item.id} className="config-list-item">
                <div>
                  <strong>{item.name}</strong>
                  <p className="hint">{summarize(item.data)}</p>
                </div>
                <Link
                  className="button secondary"
                  href={`${basePath}/edit?id=${encodeURIComponent(item.id)}`}
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </ConfigShell>
  );
}

function sortByName<T>(items: LibraryItem<T>[]): LibraryItem<T>[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}
