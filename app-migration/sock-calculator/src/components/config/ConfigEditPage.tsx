import { ConfigNotFound, ConfigShell } from "@/components/config/ConfigShell";
import { useLibraryItem } from "@/hooks/UseLibraryItems";
import { isNameTaken, updateItem, type LibraryItemType } from "@/lib/library";
import { Href, Link } from "expo-router";
import { useState, type ReactNode } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props<T> = {
  type: LibraryItemType;
  id: string;
  entityLabel: string;
  indexHref: Href;
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
        <View style={styles.panel}>
          <Text style={styles.p}>Loading…</Text>
        </View>
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
          initialName={state.item.name}
          initialData={state.item.data}
          exceptId={state.item.id}
          indexHref={indexHref}
          onSave={(name, data) => updateItem(type, state.item.id, name, data)}
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
> & {
  initialName: string;
  initialData: T;
  exceptId?: string;
  onSave: (name: string, data: T) => void;
};

export function ConfigEditor<T>({
  type,
  initialName,
  initialData,
  exceptId,
  indexHref,
  validate,
  renderFields,
  onSave,
}: EditorProps<T>) {
  const [name, setName] = useState(initialName);
  const [data, setData] = useState<T>(initialData);
  const [saved, setSaved] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const errors = [
    ...(name.trim() ? [] : ["Name is required."]),
    ...(name.trim() && isNameTaken(type, name, exceptId)
      ? ["Another item already uses that name."]
      : []),
    ...validate(data),
  ];

  function handleSave() {
    setShowErrors(true);
    if (errors.length > 0) return;
    onSave(name.trim(), data);
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
    <View style={styles.panel}>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={changeName}
        />
      </View>
      {renderFields(data, changeData)}
      {showErrors && errors.length > 0 && (
        <View style={styles.errorBox} accessibilityRole="alert">
          <Text style={styles.errorBoxText}>{errors[0]}</Text>
        </View>
      )}
      {saved && (
        <View style={styles.notice} accessibilityRole="status">
          <Text style={styles.noticeText}>Saved.</Text>
        </View>
      )}
      <View style={styles.topActions}>
        <View
          style={[styles.button, styles.secondaryButton]}
          onTouchEnd={handleSave}
        >
          <Text style={styles.secondaryButtonText}>Save</Text>
        </View>
        <Link href={indexHref} asChild>
          <View style={StyleSheet.flatten([styles.button, styles.resetButton])}>
            <Text style={styles.resetButtonText}>Back to list</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    padding: 27,
    borderRadius: 2,
  },
  p: {
    color: "#77746b",
    fontSize: 13,
  },
  field: {
    gap: 7,
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#77746b",
  },
  input: {
    backgroundColor: "#faf8f2",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    borderRadius: 2,
    color: "#24231f",
    minHeight: 44,
    paddingHorizontal: 12,
  },
  errorBox: {
    backgroundColor: "#f6d9ce",
    padding: 10,
    marginBottom: 15,
  },
  errorBoxText: {
    color: "#7d3320",
    fontSize: 12,
  },
  notice: {
    backgroundColor: "#e4eee8",
    padding: 11,
    marginTop: 18,
  },
  noticeText: {
    color: "#61766b",
    fontSize: 13,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#24231f",
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fffdf8",
  },
  resetButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd8ca",
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#77746b",
  },
});
