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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
    <View style={styles.savedItems}>
      <View style={styles.savedItemsHeader}>
        <TouchableOpacity
          style={[styles.button, styles.reset]}
          onPress={handleNew}
        >
          <Text style={styles.resetText}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.savedItemsToggle} onPress={toggleOpen}>
          <View style={[styles.chevron, open && styles.chevronUp]} />
        </TouchableOpacity>
      </View>

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.savedItemsPanel}>
            <View style={styles.savedItemsSaveRow}>
              <TextInput
                style={styles.input}
                placeholder="Name to save as…"
                value={nameDraft}
                onChangeText={setNameDraft}
              />
              <TouchableOpacity
                style={[styles.button, styles.secondary]}
                onPress={handleSave}
              >
                <Text style={styles.secondaryText}>Save</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.h3}>Load saved item</Text>
            {items.length === 0 ? (
              <Text style={styles.savedItemsEmpty}>Nothing saved yet.</Text>
            ) : (
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <TouchableOpacity
                      style={styles.savedItemsName}
                      onPress={() => handleLoad(item)}
                    >
                      <Text style={styles.itemNameText}>{item.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.reset]}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Text style={styles.resetText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
            <View style={styles.savedItemsPanelActions}>
              <TouchableOpacity
                style={[styles.button, styles.reset]}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.resetText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmingNew} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.h3}>Save before starting new?</Text>
            <Text
              style={styles.p}
            >{`"${loadedItem?.name}" has unsaved changes.`}</Text>
            <View style={styles.confirmDialogActions}>
              <TouchableOpacity
                style={[styles.button, styles.reset]}
                onPress={() => setConfirmingNew(false)}
              >
                <Text style={styles.resetText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.reset]}
                onPress={() => {
                  setConfirmingNew(false);
                  startNew();
                }}
              >
                <Text style={styles.resetText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondary]}
                onPress={() => {
                  if (loadedItem)
                    onSaved?.(saveItem(type, data, loadedItem.name));
                  setConfirmingNew(false);
                  startNew();
                }}
              >
                <Text style={styles.secondaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  savedItems: {
    position: "relative",
  },
  savedItemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  reset: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  resetText: {
    color: "#77746b",
    fontSize: 12,
    fontWeight: "700",
  },
  secondary: {
    backgroundColor: "#24231f",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryText: {
    color: "#fffdf8",
    fontSize: 12,
    fontWeight: "700",
  },
  savedItemsToggle: {
    width: 40,
    height: 40,
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#24231f",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#24231f",
  },
  chevronUp: {
    transform: [{ rotate: "180deg" }],
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(36, 35, 31, 0.4)",
  },
  savedItemsPanel: {
    backgroundColor: "#fffdf8",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd8ca",
    padding: 24,
    width: "90%",
    maxWidth: 360,
    maxHeight: 520,
    shadowColor: "#24231f",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
  savedItemsSaveRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#faf8f2",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 13,
    color: "#24231f",
    height: 38,
  },
  h3: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#24231f",
    marginBottom: 10,
  },
  savedItemsEmpty: {
    color: "#77746b",
    fontSize: 13,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    borderRadius: 4,
    paddingLeft: 12,
    paddingVertical: 4,
    marginBottom: 6,
  },
  savedItemsName: {
    flex: 1,
  },
  itemNameText: {
    fontSize: 13,
    color: "#24231f",
  },
  savedItemsPanelActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  confirmDialog: {
    backgroundColor: "#fffdf8",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd8ca",
    padding: 24,
    width: "90%",
    maxWidth: 360,
  },
  p: {
    color: "#77746b",
    fontSize: 13,
  },
  confirmDialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    paddingTop: 30,
  },
});
