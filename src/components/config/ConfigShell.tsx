import { Href, Link } from "expo-router";
import { palette } from "@/theme/colors";
import { type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type ShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export function ConfigShell({ title, eyebrow, children }: ShellProps) {
  const { width } = useWindowDimensions();
  const isCompact = width <= 850;
  const titleSize = Math.min(76, Math.max(42, width * 0.06));

  return (
    <View
      style={[
        styles.appShell,
        {
          paddingHorizontal: width <= 500 ? 18 : "5%",
          paddingTop: isCompact ? 28 : 42,
          paddingBottom: width <= 500 ? 50 : 72,
        },
      ]}
    >
      <View style={[styles.topbar, isCompact && styles.topbarCompact]}>
        <View style={styles.topbarLeft}>
          <Text style={styles.eyebrow}>{eyebrow ?? "CONFIGURATION"}</Text>
          <Text
            style={[
              styles.h1,
              { fontSize: titleSize, lineHeight: titleSize * 0.95 },
            ]}
          >
            {title}
          </Text>
        </View>
        <View
          style={[styles.topActions, isCompact && styles.topActionsCompact]}
        >
          <Link href="/config" asChild>
            <Pressable
              style={StyleSheet.flatten([styles.button, styles.resetButton])}
            >
              <Text style={styles.resetButtonText}>All configuration</Text>
            </Pressable>
          </Link>
          <Link href="/" asChild>
            <Pressable
              style={StyleSheet.flatten([styles.button, styles.resetButton])}
            >
              <Text style={styles.resetButtonText}>Calculator</Text>
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
  const isNarrow = useWindowDimensions().width <= 500;

  return (
    <View
      style={[styles.panel, isNarrow && styles.panelNarrow]}
      accessibilityRole="alert"
    >
      <Text style={styles.h2} testID="config-heading">
        {entityLabel} not found
      </Text>
      <Text style={styles.p}>
        We couldn&apos;t find that {entityLabel.toLowerCase()}. It may have been
        deleted, or the link may be wrong.
      </Text>
      <Link href={indexHref} testID="config-index-link" asChild>
        <Pressable
          style={StyleSheet.flatten([styles.button, styles.secondaryButton])}
        >
          <Text style={styles.secondaryButtonText}>{indexLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    width: "100%",
    maxWidth: 1320,
    alignSelf: "center",
    backgroundColor: palette.paper,
    paddingHorizontal: "5%",
    paddingTop: 42,
    paddingBottom: 72,
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 32,
    borderBottomWidth: 1,
    borderColor: palette.border,
    paddingBottom: 32,
    flexWrap: "wrap",
    marginBottom: 28,
  },
  topbarCompact: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
  topbarLeft: {
    flex: 2,
    minWidth: 280,
  },
  eyebrow: {
    color: palette.orange,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.54,
    marginBottom: 10,
  },
  h1: {
    fontFamily: "Georgia",
    fontSize: 42,
    fontWeight: "400",
    color: palette.textPrimary,
  },
  h2: {
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "400",
    color: "#24231f",
    marginBottom: 6,
  },
  p: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
  },
  topActionsCompact: {
    justifyContent: "flex-start",
  },
  panel: {
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 27,
    borderRadius: 2,
  },
  panelNarrow: {
    padding: 20,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: palette.textPrimary,
  },
  secondaryButtonText: {
    color: palette.panel,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.48,
  },
  resetButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border,
  },
  resetButtonText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.48,
  },
});
