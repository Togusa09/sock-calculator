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
              <Text style={[styles.detailLabel, index === rows.length - 1 && styles.lastLabel]}>
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
    marginTop: 6.5, // 10.5rem * 0.625 = ~6.5 for compact mobile view
    paddingTop: 0.25, // 0.5rem = 0.25 in style object
  },
  detailsHeader: {
    cursor: "pointer",
    fontSize: 13,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 8,
  },
  rowList: {
    gap: 0.25, // 0.5rem / 2 = 0.25 spacing
  },
  detailRow: {
    display: "flex",
    flexDirection: "row" as const,
    gap: 0, // auto from inline layout
  },
  detailLabel: {
    flex: 1,
  },
  lastLabel: {
    fontWeight: "400",
  },
  detailValue: {
    fontWeight: "600",
  },
});
