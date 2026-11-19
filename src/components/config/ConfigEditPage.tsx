import { ConfigNotFound, ConfigShell } from "@/components/config/ConfigShell";
import { useLibraryItem } from "@/hooks/UseLibraryItems";
import { isNameTaken, updateItem, type LibraryItemType } from "@/lib/library";
import { Href, Link } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

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
      {state.status === "loading" && <Text>Loading…</Text>}
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
  const [nameTaken, setNameTaken] = useState(false);

  const errors = [
    ...(name.trim() ? [] : ["Name is required."]),
    ...(name.trim() && nameTaken //isNameTaken(type, name, exceptId)
      ? ["Another item already uses that name."]
      : []),
    ...validate(data),
  ];

  useEffect(() => {
    async function checkNameTaken() {
      const taken = await isNameTaken(type, name, exceptId);
      setNameTaken(taken);
    }
    checkNameTaken();
  }, [type, name, exceptId]);

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
    <View>
      <View>
        <Text>Name *</Text>
        <TextInput value={name} onChangeText={changeName} />
      </View>
      {renderFields(data, changeData)}
      {showErrors && errors.length > 0 && (
        <View accessibilityRole="alert">
          <Text>{errors[0]}</Text>
        </View>
      )}
      {saved && (
        <View accessibilityRole="status">
          <Text>Saved.</Text>
        </View>
      )}
      <View style={{ flexDirection: "row" }}>
        <View onTouchEnd={handleSave}>
          <Text>Save</Text>
        </View>
        <Link href={indexHref} asChild>
          <View>
            <Text>Back to list</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}
