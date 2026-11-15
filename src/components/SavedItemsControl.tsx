import {
    deleteItem,
    listItems,
    nextAvailableName,
    saveItem,
    type LibraryItem,
    type LibraryItemType,
} from "@/lib/library";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { BasicButton } from "./ui/BasicButton";

export type LoadedItemInfo = {
  id?: string;
  name: string;
  dirty: boolean;
};

type Props<T> = {
  type: LibraryItemType;
  data: T;
  defaultData: T;
  onLoad: (data: T, item?: LibraryItem<T>) => void;
  onSaved?: (item: LibraryItem<T>) => void;
  onDelete?: (id: string) => void;
  onLoadedItemChange?: (info: LoadedItemInfo | null) => void;
};

export function SavedItemsControl<T>({
  type,
  data,
  defaultData,
  onLoad,
  onSaved,
  onDelete,
  onLoadedItemChange,
}: Props<T>) {
  const [items, setItems] = useState<LibraryItem<T>[]>([]);
  const [nameDraft, setNameDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [loadedItem, setLoadedItem] = useState<LibraryItem<T> | null>(null);
  const [confirmingNew, setConfirmingNew] = useState(false);

  const isDirty =
    loadedItem !== null &&
    JSON.stringify(data) !== JSON.stringify(loadedItem.data);

  const onLoadedItemChangeRef = useRef(onLoadedItemChange);
  useEffect(() => {
    onLoadedItemChangeRef.current = onLoadedItemChange;
  });
  useEffect(() => {
    onLoadedItemChangeRef.current?.(
      loadedItem
        ? { id: loadedItem.id, name: loadedItem.name, dirty: isDirty }
        : null,
    );
  }, [loadedItem, isDirty]);

  async function refresh() {
    setItems(await listItems<T>(type));
  }

  async function handleSave() {
    const name =
      nameDraft.trim() ||
      loadedItem?.name ||
      nextAvailableName(
        type,
        items.map((item) => item.name),
      );
    const saved = await saveItem(type, data, name);
    await refresh();
    setNameDraft("");
    setLoadedItem(saved);
    onSaved?.(saved);
  }

  function toggleOpen() {
    if (!open) refresh();
    setOpen((current) => !current);
  }

  function handleLoad(item: LibraryItem<T>) {
    onLoad(item.data, item);
    setLoadedItem(item);
    setNameDraft(item.name);
    setOpen(false);
  }

  function handleDelete(id: string) {
    if (onDelete) onDelete(id);
    else deleteItem(type, id);
    if (loadedItem?.id === id) setLoadedItem(null);
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

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <BasicButton onPress={handleNew}>New</BasicButton>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Saved items"
          onPress={toggleOpen}
        >
          <Text>{open ? "▲" : "▼"}</Text>
        </TouchableOpacity>
      </View>

      {open && (
        <View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder="Name to save as…"
              value={nameDraft}
              onChangeText={setNameDraft}
              accessibilityLabel="Name to save as"
            />
            <TouchableOpacity accessibilityRole="button" onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
          <Text>Load saved item</Text>
          {items.length === 0 ? (
            <Text>Nothing saved yet.</Text>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleLoad(item)}
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                  <BasicButton onPress={() => handleDelete(item.id)}>
                    Delete
                  </BasicButton>
                </View>
              )}
            />
          )}
          <BasicButton onPress={() => setOpen(false)}>Close</BasicButton>
        </View>
      )}

      <Modal visible={confirmingNew} transparent animationType="fade">
        <View>
          <Text>Save before starting new?</Text>
          <Text>{`"${loadedItem?.name}" has unsaved changes.`}</Text>
          <View style={{ flexDirection: "row" }}>
            <BasicButton onPress={() => setConfirmingNew(false)}>
              Cancel
            </BasicButton>
            <BasicButton
              onPress={() => {
                setConfirmingNew(false);
                startNew();
              }}
            >
              Discard
            </BasicButton>
            <Pressable
              accessibilityRole="button"
              onPress={async () => {
                if (loadedItem)
                  onSaved?.(await saveItem(type, data, loadedItem.name));
                setConfirmingNew(false);
                startNew();
              }}
            >
              <Text>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
