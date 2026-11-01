import type { DetailRow } from "@/lib/compactDetails";
import { Text, StyleSheet, View, Pressable, ScrollView } from "react-native";

export function CompactDetails({ rows }: { rows: DetailRow[] }) {
  return (
    <Pressable style={styles.detailsContainer}>
      <Text style={styles.detailsHeader}>Details</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.rowList}>
          {rows.map(([label, value], index) => (
            <View key={label} style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  index === rows.length - 1 && styles.lastLabel,
                ]}
              >
                {label}:{" "}
              </Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    marginLeft: 104,
    marginTop: 18,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd8ca",
  },
  detailsHeader: {
    cursor: "pointer",
    fontSize: 13,
    fontWeight: "700",
    color: "#61766b",
  },
  scrollContent: {
    paddingBottom: 8,
  },
  rowList: {
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailLabel: {
    flex: 1,
    fontSize: 12,
    opacity: 0.8,
  },
  lastLabel: {
    fontWeight: "400",
  },
  detailValue: {
    fontWeight: "600",
    fontSize: 12,
  },
});
