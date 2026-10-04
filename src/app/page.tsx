"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { Construction } from "@/src/components/Construction";
import { FootMeasurements } from "@/src/components/FootMeasurements";
import { ResultsPanel } from "@/src/components/ResultsPanel";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/src/components/SavedItemsControl";
import { YarnTension } from "@/src/components/YarnTension";
import { calculateStitches } from "@/src/lib/calculations";
import {
  DEFAULT_RECORD,
  type CalculatorRecord,
  type DisplayUnit,
} from "@/src/lib/domain";
import { parseImportedRecord, validateRecord } from "@/src/lib/validation";
import { useDataPersistence } from "../hooks/UseDataPersistence";

export default function Home() {

  const {record, 
    setRecord, 
    updateRecord,
    updateMeasurements,
    updateTension,
    updateConstruction
  } = useDataPersistence()

  const [message, setMessage] = useState("");
  const [loadedItem, setLoadedItem] = useState<LoadedItemInfo | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const unit = record.displayUnit;
  const result = useMemo(() => calculateStitches(record), [record]);

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
      <div className="workspace">
        <section className="form-column">
          <FootMeasurements
            measurements={record.measurements}
            unit={unit}
            onChange={updateMeasurements}
          />
          <YarnTension tension={record.tension} onChange={updateTension} />
          <Construction
            construction={record.construction}
            tensionNegativeEase={record.tension.negativeEasePercent}
            onChange={updateConstruction}
          />
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
        <ResultsPanel
          result={result}
          unit={unit}
          validation={validateRecord(record)}
        />
      </div>
    </main>
  );
}
