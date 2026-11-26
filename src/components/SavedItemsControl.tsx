import {
  deleteItem,
  listItems,
  nextAvailableName,
  saveItem,
  type LibraryItem,
  type LibraryItemType,
} from "@/lib/library";
import { camelToDescription } from "@/lib/stringFormatting";
import { fieldControlStyle, sharedStyles } from "@/theme/styles";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
    <View style={styles.savedItemsRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Load ${item.name}`}
        onPress={() => onLoad(item)}
      >
        <Text>{item.name}</Text>
      </Pressable>
      <BasicButton onPress={() => onDelete(item.id)}>Delete</BasicButton>
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
    <View>
      {/* Saved Items Control Heading */}
      <View style={sharedStyles.row}>
        <BasicButton
          onPress={handleNew}
        >{`New ${camelToDescription(type)}`}</BasicButton>
        <BasicButton
          testID="load-existing-button"
          onPress={toggleOpen}
        >{`Load Existing ${camelToDescription(type)}`}</BasicButton>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.centeredView}>
          <View
            accessibilityRole="dialog"
            accessibilityLabel="Load Existing dialog"
            accessibilityViewIsModal
            style={[styles.modalView, sharedStyles.container]}
          >
            {/* Borrowing the saved items row style for moment, will likely need to change */}
            <View style={styles.savedItemsRow}>
              <Text
                style={sharedStyles.heading1}
              >{`Load Existing ${camelToDescription(type)}`}</Text>
              <BasicButton
                textAlignment={"center"}
                onPress={() => setOpen(false)}
              >
                Close
              </BasicButton>
            </View>
            <View style={sharedStyles.row}>
              <TextInput
                style={[fieldControlStyle()]}
                placeholder="Name to save as…"
                value={nameDraft}
                onChangeText={setNameDraft}
                accessibilityLabel="Name to save as"
              />
              <BasicButton onPress={handleSave}>Save</BasicButton>
            </View>
            <View style={[sharedStyles.column, sharedStyles.centered]}>
              <Text style={sharedStyles.heading2}>Saved Items</Text>
              {items.length === 0 ? (
                <Text>Nothing saved yet.</Text>
              ) : (
                <FlatList
                  style={{ width: "100%" }}
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
          <View style={sharedStyles.row}>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    // backgroundColor: "white",
    // borderRadius: 20,
    borderRadius: 4,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  savedItemsRow: {
    ...sharedStyles.row,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "white",
  //   borderWidth: 1,
  //   borderColor: "black",
  //   borderRadius: 4,
  //   width: "100%",
  // },
  // row: {
  //   ...sharedStyles.row,
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   padding: 8,
  // },
  // modalBackdrop: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   padding: 16,
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  // },
  // modalHeading: {
  //   ...sharedStyles.row,
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  // saveRow: {
  //   ...sharedStyles.row,
  //   alignItems: "center",
  //   paddingVertical: 8,
  // },
  // nameInput: {
  //   flex: 1,
  //   minWidth: 0,
  // },
  // savedItemsListContainer: {
  //   flex: 1,
  //   borderTopWidth: 1,
  //   borderTopColor: "black",
  //   width: "100%",
  //   paddingTop: 8,
  // },
  // savedItemsControlBody: {
  //   ...sharedStyles.column,
  //   width: "90%",
  //   maxWidth: 600,
  //   height: "80%",
  //   justifyContent: "flex-start",
  //   backgroundColor: "white",
  //   alignItems: "flex-start",
  // },
  // savedItemRecordRowButton: {
  //   width: 80,
  // },
});
