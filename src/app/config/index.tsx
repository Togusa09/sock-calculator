import { ConfigShell } from "@/components/config/ConfigShell";
import { Panel } from "@/components/Panel/Panel";
import { palette } from "@/theme/colors";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ConfigIndexPage() {
  return (
    <ConfigShell title="Configuration">
      <Panel>
        <View style={styles.configList}>
          <View style={styles.configListItem}>
            <View style={styles.itemContent}>
              <Text style={styles.strongText}>Foot sizes</Text>
              <Text style={styles.hint}>Saved foot measurements.</Text>
            </View>
            <View style={styles.topActions}>
              <Link href="/config/foot-sizes" asChild>
                <View
                  style={StyleSheet.flatten([
                    styles.button,
                    styles.secondaryButton,
                  ])}
                >
                  <Text style={styles.secondaryButtonText}>Manage</Text>
                </View>
              </Link>
              <Link href="/config/foot-sizes/new" asChild>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Create new</Text>
                </View>
              </Link>
            </View>
          </View>

          <View style={styles.configListItem}>
            <View style={styles.itemContent}>
              <Text style={styles.strongText}>Yarn profiles</Text>
              <Text style={styles.hint}>
                Saved yarn manufacturers, weights and mixes.
              </Text>
            </View>
            <View style={styles.topActions}>
              <Link href="/config/yarn-profiles" asChild>
                <View
                  style={StyleSheet.flatten([
                    styles.button,
                    styles.secondaryButton,
                  ])}
                >
                  <Text style={styles.secondaryButtonText}>Manage</Text>
                </View>
              </Link>
              <Link href="/config/yarn-profiles/new" asChild>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Create new</Text>
                </View>
              </Link>
            </View>
          </View>
        </View>
      </Panel>
    </ConfigShell>
  );
}

const styles = StyleSheet.create({
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
    borderBottomColor: palette.border, // --line
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  strongText: {
    fontFamily: "Georgia",
    fontSize: 16,
    color: "#24231f", // --ink
    fontWeight: "600",
  },
  hint: {
    color: "#77746b", // --muted
    fontSize: 12,
    lineHeight: 18,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.48,
    color: "#24231f", // --ink
  },
  secondaryButton: {
    backgroundColor: "#24231f", // --ink
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.48,
    color: palette.panel,
  },
});
