import { palette } from "@/theme/colors";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ClearButton } from "./ui/ClearButton";

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
    <View style={styles.materialMix} testID="material-mix-editor">
      {materials.map((item, index) => (
        <View
          key={index}
          testID={`material-row-${index}`}
          style={styles.fieldRow}
        >
          <TextInput
            style={styles.input}
            placeholder="Material name"
            value={item.material}
            onChangeText={(text) => updateRow(index, { material: text })}
          />
          <View style={styles.percentContainer}>
            <TextInput
              style={styles.percentInput}
              keyboardType="number-pad"
              placeholder="0"
              value={String(item.percent)}
              onChangeText={(text) =>
                updateRow(index, { percent: Number(text) || 0 })
              }
            />
            <Text style={styles.percentLabel}>%</Text>
          </View>
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
        onPress={() => onChange([...materials, { material: "", percent: 0 }])}
        style={[styles.button, styles.buttonSecondary]}
        testID="add-material"
      >
        <Text style={styles.buttonText}>Add material</Text>
      </Pressable>
      <View style={styles.hintContainer}>
        <Text style={styles.hint}>
          Total: {total}%{total !== 100 ? " — must add up to 100%." : ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  materialMix: {
    paddingVertical: 16,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
    padding: 8,
    fontSize: 14,
    marginRight: 8,
  },
  percentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  percentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 2,
    padding: 8,
    fontSize: 14,
    marginRight: 4,
  },
  percentLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonReset: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border,
  },
  buttonSecondary: {
    backgroundColor: palette.textPrimary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.textSecondary,
  },
  hintContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  hint: {
    fontSize: 12,
    color: palette.hintText,
  },
});

type MaterialComponent = {
  material: string;
  percent: number;
};
