import { CompactDetails } from "@/components/compact/CompactDetails";
import type { DetailRow } from "@/lib/compactDetails";
import { sharedStyles } from "@/theme/styles";
import { Pressable, Text, TextInput, View } from "react-native";

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
    <View>
      <Pressable
        style={sharedStyles.row}
        onPress={() => {
          /* toggle dropdown in full app */
        }}
      >
        <Text>{label}</Text>
        <TextInput
          value={selectedLabel}
          editable={options.length > 0}
          placeholder="Select..."
        />
      </Pressable>
      {details && <CompactDetails rows={details} />}
    </View>
  );
}
