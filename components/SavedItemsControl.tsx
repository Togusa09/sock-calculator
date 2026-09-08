"use client";

import { useRef, useState } from "react";
import {
  deleteItem,
  listItems,
  nextAvailableName,
  saveItem,
  type LibraryItem,
  type LibraryItemType,
} from "@/lib/library";

type Props<T> = {
  type: LibraryItemType;
  data: T;
  onLoad: (data: T) => void;
};

export function SavedItemsControl<T>({ type, data, onLoad }: Props<T>) {
  const [items, setItems] = useState<LibraryItem<T>[]>([]);
  const [nameDraft, setNameDraft] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  function refresh() {
    setItems(listItems<T>(type));
  }

  function handleSave() {
    const name =
      nameDraft.trim() ||
      nextAvailableName(
        type,
        items.map((item) => item.name),
      );
    saveItem(type, data, name);
    refresh();
    setNameDraft("");
  }

  function openLoadDialog() {
    refresh();
    dialogRef.current?.showModal();
  }

  function handleLoad(item: LibraryItem<T>) {
    onLoad(item.data);
    dialogRef.current?.close();
  }

  function handleDelete(id: string) {
    deleteItem(type, id);
    refresh();
  }

  return (
    <div className="saved-items">
      <input
        type="text"
        placeholder="Name to save as…"
        value={nameDraft}
        onChange={(event) => setNameDraft(event.target.value)}
        aria-label="Name to save as"
      />
      <button type="button" className="button secondary" onClick={handleSave}>
        Save
      </button>
      <button
        type="button"
        className="button secondary"
        onClick={openLoadDialog}
      >
        Load
      </button>
      <dialog ref={dialogRef} className="saved-items-dialog">
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
        <div className="saved-items-dialog-actions">
          <button
            type="button"
            className="button reset"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
