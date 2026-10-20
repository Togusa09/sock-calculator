import { ConfigShell } from "@/components/config/ConfigShell";
import { useLibraryItems } from "@/hooks/UseLibraryItems";
import type { LibraryItem, LibraryItemType } from "@/lib/library";
import { Href, Link } from "expo-router";
import { type ReactNode } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type Props<T> = {
  type: LibraryItemType;
  title: string;
  basePath: string;
  emptyMessage: string;
  summarize: (data: T) => ReactNode;
};

export function ConfigListPage<T>({
  type,
  title,
  basePath,
  emptyMessage,
  summarize,
}: Props<T>) {
  const state = useLibraryItems<T>(type);

  return (
    <ConfigShell title={title}>
      <View style={styles.listActions}>
        <Link href={`${basePath}/new` as Href} asChild>
          <View
            style={StyleSheet.flatten([styles.button, styles.primaryButton])}
          >
            <Text style={styles.primaryButtonText}>Create new</Text>
          </View>
        </Link>
      </View>
      <View style={styles.panel}>
        {state.status === "loading" && <Text style={styles.p}>Loading…</Text>}
        {state.status === "ready" && state.items.length === 0 && (
          <Text style={styles.savedItemsEmpty}>{emptyMessage}</Text>
        )}
        {state.status === "ready" && state.items.length > 0 && (
          <FlatList
            data={sortByName(state.items)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.configList}
            renderItem={({ item }) => (
              <View style={styles.configListItem}>
                <View style={styles.itemContent}>
                  <Text style={styles.strongText}>{item.name}</Text>
                  <Text style={styles.hint}>{summarize(item.data)}</Text>
                </View>
                <Link
                  href={
                    `${basePath}/edit?id=${encodeURIComponent(item.id)}` as Href
                  }
                  asChild
                >
                  <View
                    style={StyleSheet.flatten([
                      styles.button,
                      styles.secondaryButton,
                    ])}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </View>
                </Link>
              </View>
            )}
          />
        )}
      </View>
    </ConfigShell>
  );
}

function sortByName<T>(items: LibraryItem<T>[]): LibraryItem<T>[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

const styles = StyleSheet.create({
  listActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  panel: {
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderColor: "#ddd8ca",
    padding: 27,
    borderRadius: 2,
  },
  p: {
    color: "#77746b",
    fontSize: 13,
  },
  savedItemsEmpty: {
    color: "#77746b",
    fontSize: 13,
  },
  configList: {
    gap: 0,
  },
  configListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd8ca",
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  strongText: {
    fontFamily: "Georgia",
    fontSize: 16,
    color: "#24231f",
    fontWeight: "600",
  },
  hint: {
    color: "#77746b",
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd8ca",
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#24231f",
  },
  secondaryButton: {
    backgroundColor: "#24231f",
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fffdf8",
  },
});
