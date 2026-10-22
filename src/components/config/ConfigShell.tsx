import { Href, Link } from "expo-router";
import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type ShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export function ConfigShell({ title, eyebrow, children }: ShellProps) {
  return (
    <View style={styles.appShell}>
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <Text style={styles.eyebrow}>{eyebrow ?? "CONFIGURATION"}</Text>
          <Text style={styles.h1}>{title}</Text>
        </View>
        <View style={styles.topActions}>
          <Link href="/config" asChild>
            <View
              style={StyleSheet.flatten([styles.button, styles.resetButton])}
            >
              <Text style={styles.resetButtonText}>All configuration</Text>
            </View>
          </Link>
          <Link href="/">
            <View
              style={StyleSheet.flatten([styles.button, styles.resetButton])}
            >
              <Text style={styles.resetButtonText}>Calculator</Text>
            </View>
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
    <View style={styles.panel} accessibilityRole="alert">
      <Text style={styles.h2}>{entityLabel} not found</Text>
      <Text style={styles.p}>
        We couldn&apos;t find that {entityLabel.toLowerCase()}. It may have been
        deleted, or the link may be wrong.
      </Text>
      <Link href={indexHref}>
        <View
          style={StyleSheet.flatten([styles.button, styles.secondaryButton])}
        >
          <Text style={styles.secondaryButtonText}>{indexLabel}</Text>
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: "#f4f1ea", // --paper
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
    borderColor: "#ddd8ca", // --line
    paddingBottom: 32,
    flexWrap: "wrap",
    marginBottom: 28,
  },
  topbarLeft: {
    flex: 2,
    minWidth: 280,
  },
  eyebrow: {
    color: "#c75b36", // --orange
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.54,
    marginBottom: 10,
  },
  h1: {
    fontFamily: "Georgia",
    fontSize: 42,
    fontWeight: "400",
    color: "#24231f", // --ink
  },
  h2: {
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "400",
    color: "#24231f",
    marginBottom: 6,
  },
  p: {
    color: "#77746b", // --muted
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
  panel: {
    backgroundColor: "#fffdf8", // --panel
    borderWidth: 1,
    borderColor: "#ddd8ca", // --line
    padding: 27,
    borderRadius: 2,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#24231f", // --ink
  },
  secondaryButtonText: {
    color: "#fffdf8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.48,
  },
  resetButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd8ca", // --line
  },
  resetButtonText: {
    color: "#77746b", // --muted
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.48,
  },
});
