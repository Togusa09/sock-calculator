"use client";

import { useState } from "react";
import { CompactResults } from "@/src/components/compact/CompactResults";
import { CompactSelect } from "@/src/components/compact/CompactSelect";
import { useLibraryItems } from "@/src/hooks/UseLibraryItems";
import { calculateStitches } from "@/src/lib/calculations";
import {
  describeConstruction,
  describeMeasurements,
  describeTension,
  describeYarn,
} from "@/src/lib/compactDetails";
import { describeYarnProfile, type LibraryItem } from "@/src/lib/library";
import type {
  CalculatorRecord,
  ConstructionOptions,
  Measurements,
  SavedTension,
  YarnProfile,
} from "@/src/lib/domain";
import { validateRecord } from "@/src/lib/validation";

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
    <main className="compact-shell">
      <h1>Sock calculator</h1>
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
    </main>
  );
}
