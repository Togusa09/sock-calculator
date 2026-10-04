import type { CalculatorRecord } from "./domain";

export function validateRecord(record: CalculatorRecord): string[] {
  const errors: string[] = [];
  if (record.schemaVersion !== 1)
    errors.push("This calculator record version is not supported.");
  if (record.measurements.footLengthCm <= 0)
    errors.push("Foot length must be greater than zero.");
  if (record.measurements.footCircumferenceCm <= 0)
    errors.push("Foot circumference must be greater than zero.");
  if (record.tension.stitchesPer10Cm <= 0)
    errors.push("Stitches per 10 cm must be greater than zero.");
  if (record.tension.rowsPer10Cm <= 0)
    errors.push("Rows per 10 cm must be greater than zero.");
  if (
    record.tension.negativeEasePercent < 0 ||
    record.tension.negativeEasePercent >= 100
  )
    errors.push("Negative ease must be between 0 and 99%.");
  return errors;
}

export function parseImportedRecord(value: string): CalculatorRecord {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || !("schemaVersion" in parsed))
    throw new Error("The selected file is not a sock calculator record.");
  const record = parsed as CalculatorRecord;
  const errors = validateRecord(record);
  if (errors.length > 0) throw new Error(errors[0]);
  return record;
}
