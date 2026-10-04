import { useCallback, useEffect, useState } from "react";
import {
  listItems,
  type LibraryItem,
  type LibraryItemType,
} from "@/src/lib/library";

export type LibraryItemsState<T> =
  { status: "loading" } | { status: "ready"; items: LibraryItem<T>[] };

export type LibraryItemState<T> =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "ready"; item: LibraryItem<T> };

/** Reads localStorage after mount, so server and first client render agree. */
export function useLibraryItems<T>(
  type: LibraryItemType,
): LibraryItemsState<T> & { reload: () => void } {
  const [items, setItems] = useState<LibraryItem<T>[] | null>(null);
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    const id = window.setTimeout(() => setItems(listItems<T>(type)), 0);
    return () => window.clearTimeout(id);
  }, [type, version]);

  return items === null
    ? { status: "loading", reload }
    : { status: "ready", items, reload };
}

export function useLibraryItem<T>(
  type: LibraryItemType,
  id: string,
): LibraryItemState<T> {
  const state = useLibraryItems<T>(type);
  if (state.status === "loading") return { status: "loading" };
  const item = state.items.find((candidate) => candidate.id === id);
  return item ? { status: "ready", item } : { status: "notFound" };
}
