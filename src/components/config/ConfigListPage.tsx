import { ConfigShell } from "@/components/config/ConfigShell";
import { useLibraryItems } from "@/hooks/UseLibraryItems";
import type { LibraryItem, LibraryItemType } from "@/lib/library";
import { sharedStyles } from "@/theme/styles";
import { Href, Link } from "expo-router";
import { type ReactNode } from "react";
import { FlatList, Text, View } from "react-native";

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
      <Link href={`${basePath}/new` as Href} asChild>
        <View>
          <Text>Create new</Text>
        </View>
      </Link>
      <View>
        {state.status === "loading" && <Text>Loading…</Text>}
        {state.status === "ready" && state.items.length === 0 && (
          <Text>{emptyMessage}</Text>
        )}
        {state.status === "ready" && state.items.length > 0 && (
          <FlatList
            data={sortByName(state.items)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={sharedStyles.row}>
                <View>
                  <Text>{item.name}</Text>
                  <Text>{summarize(item.data)}</Text>
                </View>
                <Link
                  href={
                    `${basePath}/edit?id=${encodeURIComponent(item.id)}` as Href
                  }
                  testID={`edit-link-${item.id}`}
                  asChild
                >
                  <View>
                    <Text>Edit</Text>
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
