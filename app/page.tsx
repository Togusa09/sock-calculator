"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Construction } from "@/components/Construction";
import { FootMeasurements } from "@/components/FootMeasurements";
import { ResultsPanel } from "@/components/ResultsPanel";
import { YarnTension } from "@/components/YarnTension";
import { calculateStitches } from "@/lib/calculations";
import {
  DEFAULT_RECORD,
  type CalculatorRecord,
  type DisplayUnit,
} from "@/lib/domain";
import { parseImportedRecord, validateRecord } from "@/lib/validation";

const STORAGE_KEY = "sock-calculator-record-v1";

export default function Home() {
  const [record, setRecord] = useState<CalculatorRecord>(DEFAULT_RECORD);
  const [hydrated, setHydrated] = useState(false);
  const [message, setMessage] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const unit = record.displayUnit;
  const result = useMemo(() => calculateStitches(record), [record]);

  useEffect(() => {
    const restore = () => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setRecord(parseImportedRecord(saved));
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHydrated(true);
    };
    const restoreId = window.setTimeout(restore, 0);
    return () => window.clearTimeout(restoreId);
  }, []);

  useEffect(() => {
    if (hydrated)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }, [hydrated, record]);

  function updateRecord(update: Partial<CalculatorRecord>) {
    setRecord((current) => ({ ...current, ...update }));
  }

  function updateMeasurements(
    update: Partial<CalculatorRecord["measurements"]>,
  ) {
    setRecord((current) => ({
      ...current,
      measurements: { ...current.measurements, ...update },
    }));
  }

  function updateTension(update: Partial<CalculatorRecord["tension"]>) {
    setRecord((current) => ({
      ...current,
      tension: { ...current.tension, ...update },
    }));
  }

  function updateConstruction(
    update: Partial<CalculatorRecord["construction"]>,
  ) {
    setRecord((current) => ({
      ...current,
      construction: { ...current.construction, ...update },
    }));
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

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">FIELD NOTES / KNIT PLANNING</p>
          <h1>Sock calculator</h1>
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
