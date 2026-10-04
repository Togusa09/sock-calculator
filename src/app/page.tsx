"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Construction } from "@/src/components/Construction";
import { FootMeasurements } from "@/src/components/FootMeasurements";
import { ResultsPanel } from "@/src/components/ResultsPanel";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/src/components/SavedItemsControl";
import { WizardPanel } from "@/src/components/WizardPanel";
import { WizardTabs, type WizardTab } from "@/src/components/WizardTabs";
import { YarnProfile } from "@/src/components/YarnProfile";
import { YarnTension } from "@/src/components/YarnTension";
import { calculateStitches } from "@/src/lib/calculations";
import {
  DEFAULT_RECORD,
  DEFAULT_YARN_PROFILE,
  type CalculatorRecord,
  type DisplayUnit,
} from "@/src/lib/domain";
import { parseImportedRecord, validateRecord } from "@/src/lib/validation";
import { useDataPersistence } from "../hooks/UseDataPersistence";

type SectionId = "measurements" | "yarn" | "tension" | "construction";
type TabId = SectionId | "results";

const SECTION_ORDER: SectionId[] = [
  "measurements",
  "yarn",
  "tension",
  "construction",
];

export default function Home() {
  const {
    record,
    setRecord,
    updateRecord,
    updateMeasurements,
    updateTension,
    updateConstruction,
  } = useDataPersistence();

  const [activeTab, setActiveTab] = useState<TabId>("measurements");
  const [lastSection, setLastSection] = useState<SectionId>("measurements");
  const [message, setMessage] = useState("");
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const unit = record.displayUnit;
  const result = useMemo(() => calculateStitches(record), [record]);

  const errors = validateRecord(record);
  const tabs: WizardTab[] = [
    {
      id: "measurements",
      step: "01",
      label: "Foot",
      hasError: errors.some((e) => e.startsWith("Foot")),
    },
    {
      id: "yarn",
      step: "02",
      label: "Yarn",
      hasError: errors.some(
        (e) =>
          e.startsWith("Yarn") ||
          e.startsWith("Material") ||
          e.startsWith("Each material"),
      ),
    },
    {
      id: "tension",
      step: "03",
      label: "Tension",
      hasError: errors.some((e) => /per 10 cm|ease/i.test(e)),
    },
    { id: "construction", step: "04", label: "Construction" },
    { id: "results", step: "05", label: "Results", mobileOnly: true },
  ];

  function selectTab(id: string) {
    setActiveTab(id as TabId);
    if (id !== "results") setLastSection(id as SectionId);
  }

  function stepFrom(section: SectionId, offset: number) {
    return SECTION_ORDER[SECTION_ORDER.indexOf(section) + offset];
  }

  // Desktop has no results tab, so it keeps showing the last section.
  const desktopSection = activeTab === "results" ? lastSection : activeTab;

  function panel(section: SectionId, children: ReactNode) {
    const prev = stepFrom(section, -1);
    const next = stepFrom(section, 1);
    return (
      <WizardPanel
        id={section}
        active={activeTab === section}
        desktopActive={desktopSection === section}
        onBack={prev ? () => selectTab(prev) : undefined}
        onNext={() => selectTab(next ?? "results")}
        nextLabel={next ? "Next" : "View results"}
      >
        {children}
      </WizardPanel>
    );
  }
  function exportRecord() {
    const blob = new Blob([JSON.stringify(record, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sock-calculator-record.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Record exported.");
  }

  async function importRecord(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setRecord(parseImportedRecord(await file.text()));
      setMessage("Record imported.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not import that record.",
      );
    }
    event.target.value = "";
  }

  function loadProject(loaded: CalculatorRecord) {
    const errors = validateRecord(loaded);
    if (errors.length > 0) {
      setMessage(errors[0]);
      return;
    }
    setRecord(loaded);
    setMessage("Project loaded.");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">FIELD NOTES / KNIT PLANNING</p>
          <h1>
            Sock calculator
            {loadedItem && (
              <span className="loaded-item-name">
                {" "}
                — {loadedItem.name}
                {loadedItem.dirty ? " (edited)" : ""}
              </span>
            )}
          </h1>
          <p className="intro">
            A calm starting point for a better-fitting pair. Enter the
            essentials and the construction math stays visible.
          </p>
        </div>
        <div className="top-actions">
          <label className="unit-toggle">
            Display{" "}
            <select
              value={unit}
              onChange={(event) =>
                updateRecord({ displayUnit: event.target.value as DisplayUnit })
              }
            >
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </label>
          <SavedItemsControl
            type="project"
            data={record}
            defaultData={DEFAULT_RECORD}
            onLoad={loadProject}
            onLoadedItemChange={setLoadedItem}
          />
          <button className="button secondary" onClick={exportRecord}>
            Export JSON
          </button>
          <button
            className="button secondary"
            onClick={() => importRef.current?.click()}
          >
            Import JSON
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            hidden
            onChange={importRecord}
          />
        </div>
      </header>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      <div className="workspace wizard" data-tab={activeTab}>
        <WizardTabs tabs={tabs} activeId={activeTab} onSelect={selectTab} />
        <section className="form-column">
          {panel(
            "measurements",
            <FootMeasurements
              measurements={record.measurements}
              unit={unit}
              onChange={updateMeasurements}
            />,
          )}
          {panel(
            "yarn",
            <YarnProfile
              profile={record.yarnProfile ?? DEFAULT_YARN_PROFILE}
              profileId={record.yarnProfileId}
              onChange={(update) =>
                updateRecord({
                  yarnProfile: {
                    ...(record.yarnProfile ?? DEFAULT_YARN_PROFILE),
                    ...update,
                  },
                })
              }
              onSelect={(yarnProfile, yarnProfileId) =>
                updateRecord({ yarnProfile, yarnProfileId })
              }
            />,
          )}
          {panel(
            "tension",
            <YarnTension
              tension={record.tension}
              yarnProfile={record.yarnProfile ?? DEFAULT_YARN_PROFILE}
              yarnProfileId={record.yarnProfileId}
              onChange={updateTension}
            />,
          )}
          {panel(
            "construction",
            <Construction
              construction={record.construction}
              tensionNegativeEase={record.tension.negativeEasePercent}
              onChange={updateConstruction}
            />,
          )}
          <button
            className="button reset"
            onClick={() => {
              setRecord(DEFAULT_RECORD);
              setMessage("Defaults restored.");
            }}
          >
            Restore defaults
          </button>
        </section>
        <div
          id="tabpanel-results"
          role="tabpanel"
          aria-labelledby="tab-results"
          className={
            activeTab === "results"
              ? "wizard-results is-active"
              : "wizard-results"
          }
        >
          <ResultsPanel result={result} unit={unit} validation={errors} />
        </div>
      </div>{" "}
    </main>
  );
}
