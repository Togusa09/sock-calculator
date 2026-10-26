import { parseImportedRecord } from "@/lib/validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetStateAction, useEffect, useState } from "react";
import { CalculatorRecord, DEFAULT_RECORD } from "../lib/domain";

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
    const restore = async () => {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        try {
          setRecord(parseImportedRecord(saved));
        } catch {
          await AsyncStorage.removeItem(storageKey);
        }
      }
      setHydrated(true);
    };
    const restoreId = window.setTimeout(restore, 0);
    return () => window.clearTimeout(restoreId);
  }, [storageKey]);

  useEffect(() => {
    const hydrate = async () => {
      if (hydrated) {
        await AsyncStorage.setItem(storageKey, JSON.stringify(record));
      }
    };
    hydrate();
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
