import { Pressable, Text, TextInput, View } from "react-native";
import { ClearButton } from "../ui/ClearButton";

type Props = {
  materials: MaterialComponent[];
  onChange: (materials: MaterialComponent[]) => void;
};

export function MaterialMixEditor({ materials, onChange }: Props) {
  const total = materials.reduce((sum, item) => sum + item.percent, 0);

  function updateRow(index: number, update: Partial<MaterialComponent>) {
    onChange(
      materials.map((item, i) => (i === index ? { ...item, ...update } : item)),
    );
  }

  return (
    <View testID="material-mix-editor">
      <Text>Material mix</Text>
      {materials.map((item, index) => (
        <View
          key={index}
          testID={`material-row-${index}`}
          style={{ flexDirection: "row" }}
        >
          <TextInput
            placeholder="Material name"
            value={item.material}
            onChangeText={(text) => updateRow(index, { material: text })}
          />
          <TextInput
            keyboardType="number-pad"
            placeholder="0"
            value={String(item.percent)}
            onChangeText={(text) =>
              updateRow(index, { percent: Number(text) || 0 })
            }
          />
          <Text>%</Text>
          {materials.length > 1 && (
            <ClearButton
              onPress={() => onChange(materials.filter((_, i) => i !== index))}
            >
              Remove
            </ClearButton>
          )}
        </View>
      ))}
      <Pressable
        accessibilityRole="button"
        onPress={() => onChange([...materials, { material: "", percent: 0 }])}
        testID="add-material"
      >
        <Text>Add material</Text>
      </Pressable>
      <Text>
        Total: {total}%{total !== 100 ? " — must add up to 100%." : ""}
      </Text>
    </View>
  );
}

type MaterialComponent = {
  material: string;
  percent: number;
};
