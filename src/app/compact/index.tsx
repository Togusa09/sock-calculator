import { CompactResults } from "@/components/compact/CompactResults";
import { CompactSelect } from "@/components/compact/CompactSelect";
import { useLibraryItems } from "@/hooks/UseLibraryItems";
import { calculateStitches } from "@/lib/calculations";
import {
  describeConstruction,
  describeMeasurements,
  describeTension,
  describeYarn,
} from "@/lib/compactDetails";
import type {
  CalculatorRecord,
  ConstructionOptions,
  Measurements,
  SavedTension,
  YarnProfile,
} from "@/lib/domain";
import { describeYarnProfile, type LibraryItem } from "@/lib/library";
import { validateRecord } from "@/lib/validation";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

function itemsOf<T>(state: { status: string; items?: LibraryItem<T>[] }) {
  return state.items ?? [];
}

export default function CompactPage() {
  const [footId, setFootId] = useState("");
  const [yarnId, setYarnId] = useState("");
  const [tensionId, setTensionId] = useState("");
  const [constructionId, setConstructionId] = useState("");

  const feet = itemsOf(useLibraryItems<Measurements>("measurements"));
  const yarns = itemsOf(useLibraryItems<YarnProfile>("yarnProfile"));
  const tensions = itemsOf(useLibraryItems<SavedTension>("tension"));
  const constructions = itemsOf(
    useLibraryItems<ConstructionOptions>("construction"),
  );

  const yarnTensions = tensions.filter((t) => t.data.yarnProfileId === yarnId);
  const foot = feet.find((i) => i.id === footId);
  const yarn = yarns.find((i) => i.id === yarnId);
  const tension = yarnTensions.find((i) => i.id === tensionId);
  const construction = constructions.find((i) => i.id === constructionId);

  function buildRecord(): CalculatorRecord | null {
    if (!foot || !yarn || !tension || !construction) return null;
    const { yarnProfileId, ...yarnTension } = tension.data;
    return {
      schemaVersion: 1,
      displayUnit: "metric",
      measurements: foot.data,
      yarnProfileId,
      yarnProfile: yarn.data,
      tension: yarnTension,
      construction: construction.data,
    };
  }
  const record = buildRecord();

  return (
    <View style={styles.page}>
      <View style={styles.compactShell}>
        <Text style={styles.heading}>Sock calculator</Text>
        <CompactSelect
          label="Foot"
          value={footId}
          onChange={setFootId}
          details={foot && describeMeasurements(foot.data)}
          options={feet.map((i) => ({ id: i.id, label: i.name }))}
        />
        <CompactSelect
          label="Yarn"
          value={yarnId}
          onChange={(id) => {
            setYarnId(id);
            setTensionId("");
          }}
          details={yarn && describeYarn(yarn.data)}
          options={yarns.map((i) => ({
            id: i.id,
            label: `${i.name} — ${describeYarnProfile(i.data)}`,
          }))}
        />
        <CompactSelect
          label="Tension"
          value={tensionId}
          onChange={setTensionId}
          details={tension && describeTension(tension.data)}
          options={yarnTensions.map((i) => ({
            id: i.id,
            label: `${i.data.needleSizeMm} mm — ${i.name}`,
          }))}
        />
        <CompactSelect
          label="Construction"
          value={constructionId}
          onChange={setConstructionId}
          details={construction && describeConstruction(construction.data)}
          options={constructions.map((i) => ({ id: i.id, label: i.name }))}
        />
        {record && (
          <CompactResults
            result={calculateStitches(record)}
            errors={validateRecord(record)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f4f1ea",
  },
  compactShell: {
    flex: 1,
    width: "100%",
    maxWidth: 448,
    alignSelf: "center",
    padding: 12,
    gap: 8,
  },
  heading: {
    fontFamily: "Georgia",
    fontSize: 18,
    fontWeight: "400",
    color: "#24231f",
    marginBottom: 0,
  },
});
