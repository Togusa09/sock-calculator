import { ConfigShell } from "@/components/config/ConfigShell";
import { Panel } from "@/components/Panel/Panel";
import { sharedStyles } from "@/theme/styles";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ConfigIndexPage() {
  return (
    <ConfigShell title="Configuration">
      <Panel>
        <View>
          <Text>Foot sizes</Text>
          <Text>Saved foot measurements.</Text>
          <View style={sharedStyles.row}>
            <Link href="/config/foot-sizes">
              <Text>Manage</Text>
            </Link>
            <Link href="/config/foot-sizes/new">
              <Text>Create new</Text>
            </Link>
          </View>
        </View>

        <View>
          <Text>Yarn profiles</Text>
          <Text>Saved yarn manufacturers, weights and mixes.</Text>
          <View style={sharedStyles.row}>
            <Link href="/config/yarn-profiles">
              <Text>Manage</Text>
            </Link>
            <Link href="/config/yarn-profiles/new">
              <Text>Create new</Text>
            </Link>
          </View>
        </View>
      </Panel>
    </ConfigShell>
  );
}
