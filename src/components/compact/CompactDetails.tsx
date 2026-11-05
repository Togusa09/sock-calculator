import type { DetailRow } from "@/lib/compactDetails";
import { Text, View } from "react-native";

export function CompactDetails({ rows }: { rows: DetailRow[] }) {
  return (
    <View>
      <Text>Details</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={{ flexDirection: "row" }}>
          <Text>{label}: </Text>
          <Text>{value}</Text>
        </View>
      ))}
    </View>
  );
}
