import type { DetailRow } from "@/lib/compactDetails";
import { sharedStyles } from "@/theme/styles";
import { Text, View } from "react-native";

export function CompactDetails({ rows }: { rows: DetailRow[] }) {
  return (
    <View>
      <Text>Details</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={sharedStyles.row}>
          <Text>{label}: </Text>
          <Text>{value}</Text>
        </View>
      ))}
    </View>
  );
}
