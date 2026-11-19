import {
  deleteItem,
  listItems,
  nextAvailableName,
  saveItem,
  type LibraryItem,
  type LibraryItemType,
} from "@/lib/library";
import { camelToDescription } from "@/lib/stringFormatting";
import { fieldControlStyle } from "@/theme/styles";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
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

type SavedItemRecordProps<T> = {
  item: LibraryItem<T>;
  onLoad: (item: LibraryItem<T>) => void;
  onDelete: (id: string) => void;
};

function SavedItemRecord<T>({
  item,
  onLoad,
  onDelete,
}: SavedItemRecordProps<T>) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Load ${item.name}`}
        onPress={() => onLoad(item)}
      >
        <Text>{item.name}</Text>
      </Pressable>
      <BasicButton
        onPress={() => onDelete(item.id)}
        width={styles.savedItemRecordRowButton.width}
      >
        Delete
      </BasicButton>
    </View>
  );
}

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
    <View style={styles.container}>
      {/* Saved Items Control Heading */}
      <View style={styles.row}>
        <BasicButton
          onPress={handleNew}
        >{`New ${camelToDescription(type)}`}</BasicButton>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Load Existing ${camelToDescription(type)}`}
          accessibilityState={{ expanded: open }}
          onPress={toggleOpen}
        >
          <Text>{`Load Existing ${camelToDescription(type)}`}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            accessibilityRole="dialog"
            accessibilityLabel="Load Existing dialog"
            accessibilityViewIsModal
            style={[styles.savedItemsControlBody, styles.column]}
          >
            <View style={styles.modalHeading}>
              <Text>{`Load Existing ${camelToDescription(type)}`}</Text>
              <BasicButton onPress={() => setOpen(false)}>Close</BasicButton>
            </View>
            <View style={styles.saveRow}>
              <TextInput
                style={[fieldControlStyle(), styles.nameInput]}
                placeholder="Name to save as…"
                value={nameDraft}
                onChangeText={setNameDraft}
                accessibilityLabel="Name to save as"
              />
              <BasicButton onPress={handleSave}>Save</BasicButton>
            </View>
            <View style={styles.savedItemsListContainer}>
              <Text>Load saved item</Text>
              {items.length === 0 ? (
                <Text>Nothing saved yet.</Text>
              ) : (
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <SavedItemRecord
                      item={item}
                      onLoad={handleLoad}
                      onDelete={handleDelete}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmingNew}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmingNew(false)}
      >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,

    width: "100%",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  column: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalHeading: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
  },
  savedItemsListContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "black",
    width: "100%",
    paddingTop: 8,
  },
  savedItemsControlBody: {
    width: "90%",
    maxWidth: 600,
    height: "80%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    alignItems: "flex-start",
  },
  savedItemRecordRowButton: {
    width: 80,
  },
});
