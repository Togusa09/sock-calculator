import { sharedStyles } from "@/theme/styles";
import { Href, Link } from "expo-router";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type ShellProps = {
  title: string;
  children: ReactNode;
};

export function ConfigShell({ title, children }: ShellProps) {
  return (
    <View>
      <View>
        <Text>{title}</Text>
        <View style={sharedStyles.row}>
          <Link href="/config" asChild>
            <Pressable accessibilityRole="link">
              <Text>All configuration</Text>
            </Pressable>
          </Link>
          <Link href="/" asChild>
            <Pressable accessibilityRole="link">
              <Text>Calculator</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      {children}
    </View>
  );
}

type NotFoundProps = {
  entityLabel: string;
  indexHref: Href;
  indexLabel: string;
};

export function ConfigNotFound({
  entityLabel,
  indexHref,
  indexLabel,
}: NotFoundProps) {
  return (
    <View accessibilityRole="alert">
      <Text testID="config-heading">{entityLabel} not found</Text>
      <Text>
        We couldn&apos;t find that {entityLabel.toLowerCase()}. It may have been
        deleted, or the link may be wrong.
      </Text>
      <Link href={indexHref} testID="config-index-link" asChild>
        <Pressable accessibilityRole="link">
          <Text>{indexLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
}
