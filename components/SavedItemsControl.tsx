"use client";

import { useEffect, useRef, useState } from "react";
import {
  deleteItem,
  listItems,
  nextAvailableName,
  saveItem,
  type LibraryItem,
  type LibraryItemType,
} from "@/lib/library";

export type LoadedItemInfo = {
  name: string;
  dirty: boolean;
};

type Props<T> = {
  type: LibraryItemType;
  data: T;
  defaultData: T;
  onLoad: (data: T) => void;
  onLoadedItemChange?: (info: LoadedItemInfo | null) => void;
};

export function SavedItemsControl<T>({
  type,
  data,
  defaultData,
  onLoad,
  onLoadedItemChange,
}: Props<T>) {
  const [items, setItems] = useState<LibraryItem<T>[]>([]);
  const [nameDraft, setNameDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [loadedItem, setLoadedItem] = useState<LibraryItem<T> | null>(null);
  const [confirmingNew, setConfirmingNew] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDirty =
    loadedItem !== null &&
    JSON.stringify(data) !== JSON.stringify(loadedItem.data);

  // Keep the latest callback without re-triggering the notify effect on every parent render.
  const onLoadedItemChangeRef = useRef(onLoadedItemChange);
  useEffect(() => {
    onLoadedItemChangeRef.current = onLoadedItemChange;
  });
  useEffect(() => {
    onLoadedItemChangeRef.current?.(
      loadedItem ? { name: loadedItem.name, dirty: isDirty } : null,
    );
  }, [loadedItem, isDirty]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!confirmingNew) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setConfirmingNew(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmingNew]);

  function refresh() {
    setItems(listItems<T>(type));
  }

  function handleSave() {
    const name =
      nameDraft.trim() ||
      loadedItem?.name ||
      nextAvailableName(
        type,
        items.map((item) => item.name),
      );
    const saved = saveItem(type, data, name);
    refresh();
    setNameDraft("");
    setLoadedItem(saved);
  }

  function toggleOpen() {
    if (!open) refresh();
    setOpen((current) => !current);
  }

  function handleLoad(item: LibraryItem<T>) {
    onLoad(item.data);
    setLoadedItem(item);
    setNameDraft(item.name);
    setOpen(false);
  }

  function handleDelete(id: string) {
    deleteItem(type, id);
    refresh();
  }

  function handleNew() {
    if (loadedItem && isDirty) {
      setConfirmingNew(true);
      return;
    }
    startNew();
  }

  function startNew() {
    onLoad(defaultData);
    setLoadedItem(null);
    setNameDraft("");
    setOpen(false);
  }

  function confirmNewWithSave() {
    if (loadedItem) {
      saveItem(type, data, loadedItem.name);
      refresh();
    }
    setConfirmingNew(false);
    startNew();
  }

  function confirmNewWithoutSave() {
    setConfirmingNew(false);
    startNew();
  }

  return (
    <div className="saved-items" ref={containerRef}>
      <button type="button" className="button reset" onClick={handleNew}>
        New
      </button>
      <button
        type="button"
        className="saved-items-toggle"
        aria-expanded={open}
        aria-label="Save or load"
        onClick={toggleOpen}
      >
        <span className={open ? "chevron chevron-up" : "chevron"} />
      </button>
      {open && (
        <div className="saved-items-panel">
          <div className="saved-items-save-row">
            <input
              type="text"
              placeholder="Name to save as…"
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              aria-label="Name to save as"
            />
            <button
              type="button"
              className="button secondary"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <h3>Load saved item</h3>
          {items.length === 0 ? (
            <p className="saved-items-empty">Nothing saved yet.</p>
          ) : (
            <ul className="saved-items-list">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="saved-items-name"
                    onClick={() => handleLoad(item)}
                  >
                    {item.name}
                  </button>
                  <button
                    type="button"
                    className="button reset"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="saved-items-panel-actions">
            <button
              type="button"
              className="button reset"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {confirmingNew && (
        <div
          className="confirm-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setConfirmingNew(false);
          }}
        >
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-new-heading"
          >
            <h3 id="confirm-new-heading">Save before starting new?</h3>
            <p>{`"${loadedItem?.name}" has unsaved changes.`}</p>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="button reset"
                onClick={() => setConfirmingNew(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button reset"
                onClick={confirmNewWithoutSave}
              >
                Discard
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={confirmNewWithSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
