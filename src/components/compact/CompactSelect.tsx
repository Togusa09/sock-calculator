import { CompactDetails } from "@/components/compact/CompactDetails";
import type { DetailRow } from "@/lib/compactDetails";
import { palette } from "@/theme/colors";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Option = { id: string; label: string };

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  details?: DetailRow[];
};

export function CompactSelect({
  label,
  options,
  value,
  onChange,
  details,
}: Props) {
  // Use TextInput as a placeholder for select - RN has limited native select support
  const selectedLabel =
    options.find((o) => o.id === value)?.label ||
    (options.length === 0 ? "None saved" : "Select…");

  return (
    <View style={styles.compactItem} className="compact-item">
      <Pressable
        style={styles.compactField}
        onPress={() => {
          /* toggle dropdown in full app */
        }}
      >
        <Text style={styles.compactFieldLabel}>{label}</Text>
        <TextInput
          value={selectedLabel}
          editable={options.length > 0}
          style={styles.compactFieldInput}
          placeholder="Select..."
          placeholderTextColor={palette.muted}
          selectionColor={palette.orange}
        />
      </Pressable>
      {details && <CompactDetails rows={details} />}
    </View>
  );
}

const styles = StyleSheet.create({
  compactItem: {}, // container for compact item
  compactField: {
    flexDirection: "row",
    gap: 0.5, // 0.5rem spacing
    fontSize: 13.6, // 0.85rem ≈ 13.6px
    alignItems: "center",
  },
  compactFieldLabel: {
    width: 96, // 6rem ≈ 96px at 16px base
    fontSize: 13.6,
  },
  compactFieldInput: {
    flex: 1,
    minHeight: 44, // native minimum touch target
    padding: 0.5, // 0.3rem ≈ 0.5 for RN TextInput
    borderRadius: 2,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.inputBackground,
    color: palette.textPrimary,
    fontSize: 13,
  },
});
