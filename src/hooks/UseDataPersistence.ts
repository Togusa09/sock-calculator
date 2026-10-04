import { SetStateAction, useEffect, useState } from "react";
import { CalculatorRecord, DEFAULT_RECORD } from "../lib/domain";
import { parseImportedRecord, validateRecord } from "@/src/lib/validation";

const STORAGE_KEY = "sock-calculator-record-v1";

type Props = {
  initialValue: CalculatorRecord;
  storageKey: string;
};

export function useDataPersistence(
  { initialValue, storageKey }: Props = {
    initialValue: DEFAULT_RECORD,
    storageKey: STORAGE_KEY,
  },
) {
  const [record, setRecord] = useState<CalculatorRecord>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restore = () => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          setRecord(parseImportedRecord(saved));
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }
      setHydrated(true);
    };
    const restoreId = window.setTimeout(restore, 0);
    return () => window.clearTimeout(restoreId);
  }, [storageKey]);

  useEffect(() => {
    if (hydrated)
      window.localStorage.setItem(storageKey, JSON.stringify(record));
  }, [hydrated, record, storageKey]);

  function setRecordFromExternal(
    value: SetStateAction<CalculatorRecord>,
  ): void {
    // Added method here in case we need to intercept the update requests
    setRecord(value);
  }

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

  return {
    record,
    setRecord: setRecordFromExternal,
    updateRecord,
    updateMeasurements,
    updateTension,
    updateConstruction,
  };
}
