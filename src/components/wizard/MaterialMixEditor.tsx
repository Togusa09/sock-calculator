import { fieldControlStyle, sharedStyles } from "@/theme/styles";
import { Text, TextInput, View } from "react-native";
import { BasicButton } from "../ui/BasicButton";

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
      <View style={[sharedStyles.column,]}>
      {materials.map((item, index) => (
        <View
          key={index}
          testID={`material-row-${index}`}
          style={[
            sharedStyles.row,
          ]}
        >
          <TextInput
            style={fieldControlStyle()}
            placeholder="Material name"
            value={item.material}
            onChangeText={(text) => updateRow(index, { material: text })}
          />
          <TextInput
            style={fieldControlStyle()}
            keyboardType="number-pad"
            placeholder="0"
            value={String(item.percent)}
            onChangeText={(text) =>
              updateRow(index, { percent: Number(text) || 0 })
            }
          />
          <Text>%</Text>
          {materials.length > 1 && (
            <BasicButton
              onPress={() => onChange(materials.filter((_, i) => i !== index))}
            >
              Remove
            </BasicButton>
          )}
        </View>
      ))}
      </View>
      <View style={sharedStyles.row}>
        <BasicButton
          onPress={() => onChange([...materials, { material: "", percent: 0 }])}
        >
          Add material
        </BasicButton>
          <Text>
        Total: {total}%{total !== 100 ? " — must add up to 100%." : ""}
      </Text>
      </View>
    
    </View>
  );
}

type MaterialComponent = {
  material: string;
  percent: number;
};
