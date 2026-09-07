"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { calculateStitches } from "@/lib/calculations";
import { DEFAULT_RECORD, type CalculatorRecord, type DisplayUnit } from "@/lib/domain";
import { formatMeasurement, fromCentimetres, measurementLabel, toCentimetres } from "@/lib/units";
import { parseImportedRecord, validateRecord } from "@/lib/validation";

const STORAGE_KEY = "sock-calculator-record-v1";

function NumberField({ label, value, unit, onChange, required = false }: { label: string; value: number | undefined; unit: DisplayUnit; onChange: (value: number | undefined) => void; required?: boolean }) {
  return <label className="field"><span>{label}{required ? " *" : ""}</span><input type="number" min="0" step="0.1" value={value === undefined ? "" : Number(fromCentimetres(value, unit).toFixed(2))} onChange={(event) => onChange(event.target.value === "" ? undefined : toCentimetres(Number(event.target.value), unit))} /><small>{measurementLabel(unit)}</small></label>;
}

function ResultMetric({ label, value, unit, source }: { label: string; value: number; unit: DisplayUnit; source?: "entered" | "calculated" }) {
  return <div className="metric"><span>{label}</span><strong>{formatMeasurement(value, unit)}</strong>{source === "calculated" && <em>calculated</em>}</div>;
}

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
        try { setRecord(parseImportedRecord(saved)); } catch { window.localStorage.removeItem(STORAGE_KEY); }
      }
      setHydrated(true);
    };
    const restoreId = window.setTimeout(restore, 0);
    return () => window.clearTimeout(restoreId);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }, [hydrated, record]);

  function updateRecord(update: Partial<CalculatorRecord>) { setRecord((current) => ({ ...current, ...update })); }
  function updateMeasurements(update: Partial<CalculatorRecord["measurements"]>) { setRecord((current) => ({ ...current, measurements: { ...current.measurements, ...update } })); }
  function updateTension(update: Partial<CalculatorRecord["tension"]>) { setRecord((current) => ({ ...current, tension: { ...current.tension, ...update } })); }
  function updateConstruction(update: Partial<CalculatorRecord["construction"]>) { setRecord((current) => ({ ...current, construction: { ...current.construction, ...update } })); }

  function exportRecord() {
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "sock-calculator-record.json"; link.click(); URL.revokeObjectURL(url);
    setMessage("Record exported.");
  }

  async function importRecord(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try { const imported = parseImportedRecord(await file.text()); setRecord(imported); setMessage("Record imported."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not import that record."); }
    event.target.value = "";
  }

  const derived = result.derived;
  const validation = validateRecord(record);

  return <main className="app-shell">
    <header className="topbar"><div><p className="eyebrow">FIELD NOTES / KNIT PLANNING</p><h1>Sock calculator</h1><p className="intro">A calm starting point for a better-fitting pair. Enter the essentials and the construction math stays visible.</p></div><div className="top-actions"><label className="unit-toggle">Display <select value={unit} onChange={(event) => updateRecord({ displayUnit: event.target.value as DisplayUnit })}><option value="metric">Metric</option><option value="imperial">Imperial</option></select></label><button className="button secondary" onClick={exportRecord}>Export JSON</button><button className="button secondary" onClick={() => importRef.current?.click()}>Import JSON</button><input ref={importRef} type="file" accept="application/json" hidden onChange={importRecord} /></div></header>
    {message && <p className="notice" role="status">{message}</p>}
    <div className="workspace">
      <section className="form-column">
        <section className="panel"><div className="section-heading"><span className="step">01</span><div><h2>Foot measurements</h2><p>Two measurements are enough to begin.</p></div></div><div className="field-grid"><NumberField label="Foot length" value={record.measurements.footLengthCm} unit={unit} required onChange={(value) => updateMeasurements({ footLengthCm: value ?? 0 })} /><NumberField label="Ball circumference" value={record.measurements.footCircumferenceCm} unit={unit} required onChange={(value) => updateMeasurements({ footCircumferenceCm: value ?? 0 })} /></div><details><summary>More measurements</summary><div className="field-grid"><NumberField label="Heel diagonal" value={record.measurements.heelDiagonalCm} unit={unit} onChange={(value) => updateMeasurements({ heelDiagonalCm: value })} /><NumberField label="Ankle circumference" value={record.measurements.ankleCircumferenceCm} unit={unit} onChange={(value) => updateMeasurements({ ankleCircumferenceCm: value })} /><NumberField label="Heel height" value={record.measurements.heelHeightCm} unit={unit} onChange={(value) => updateMeasurements({ heelHeightCm: value })} /><NumberField label="Instep circumference" value={record.measurements.instepCircumferenceCm} unit={unit} onChange={(value) => updateMeasurements({ instepCircumferenceCm: value })} /><NumberField label="Toe length" value={record.measurements.toeLengthCm} unit={unit} onChange={(value) => updateMeasurements({ toeLengthCm: value })} /><NumberField label="Low calf circumference" value={record.measurements.lowCalfCircumferenceCm} unit={unit} onChange={(value) => updateMeasurements({ lowCalfCircumferenceCm: value })} /><NumberField label="High calf circumference" value={record.measurements.highCalfCircumferenceCm} unit={unit} onChange={(value) => updateMeasurements({ highCalfCircumferenceCm: value })} /></div></details></section>
        <section className="panel"><div className="section-heading"><span className="step">02</span><div><h2>Yarn tension</h2><p>Gauge and ease shape the fit.</p></div></div><div className="field-grid"><label className="field"><span>Stitches per 10 cm *</span><input type="number" min="1" step="0.5" value={record.tension.stitchesPer10Cm} onChange={(event) => updateTension({ stitchesPer10Cm: Number(event.target.value) })} /><small>sts</small></label><label className="field"><span>Rows per 10 cm *</span><input type="number" min="1" step="0.5" value={record.tension.rowsPer10Cm} onChange={(event) => updateTension({ rowsPer10Cm: Number(event.target.value) })} /><small>rows</small></label><label className="field"><span>Needle size</span><input type="number" min="0.1" step="0.1" value={record.tension.needleSizeMm} onChange={(event) => updateTension({ needleSizeMm: Number(event.target.value) })} /><small>mm</small></label><label className="field"><span>Negative ease</span><input type="number" min="0" max="99" step="1" value={record.tension.negativeEasePercent} onChange={(event) => updateTension({ negativeEasePercent: Number(event.target.value) })} /><small>%</small></label></div><p className="hint">A swatch under 10 cm can be less accurate. The gauge above is stored in metric regardless of display unit.</p></section>
        <section className="panel"><div className="section-heading"><span className="step">03</span><div><h2>Construction</h2><p>Choose the shape you plan to knit.</p></div></div><div className="select-grid"><label className="field"><span>Cuff</span><select value={record.construction.cuffStyle} onChange={(event) => updateConstruction({ cuffStyle: event.target.value as CalculatorRecord["construction"]["cuffStyle"] })}><option value="ribbed">Ribbed cuff</option><option value="folded">Folded cuff</option></select></label><label className="field"><span>Ribbing repeat</span><select value={record.construction.ribbing} onChange={(event) => updateConstruction({ ribbing: event.target.value as CalculatorRecord["construction"]["ribbing"] })}><option>1x1</option><option>1x2</option><option>2x2</option><option>3x3</option></select></label><label className="field"><span>Heel</span><select value={record.construction.heelStyle} onChange={(event) => updateConstruction({ heelStyle: event.target.value as CalculatorRecord["construction"]["heelStyle"] })}><option value="gussetted">Gussetted</option><option value="afterthought">Afterthought</option><option value="short-row">Short-row</option></select></label><label className="field"><span>Toe</span><select value={record.construction.toeStyle} onChange={(event) => updateConstruction({ toeStyle: event.target.value as CalculatorRecord["construction"]["toeStyle"] })}><option value="round">Round</option><option value="star">Star</option></select></label></div><label className="override"><input type="checkbox" checked={record.construction.negativeEasePercent !== undefined} onChange={(event) => updateConstruction({ negativeEasePercent: event.target.checked ? record.tension.negativeEasePercent : undefined })} /> Override project ease</label>{record.construction.negativeEasePercent !== undefined && <label className="field compact"><span>Project negative ease</span><input type="number" min="0" max="99" value={record.construction.negativeEasePercent} onChange={(event) => updateConstruction({ negativeEasePercent: Number(event.target.value) })} /><small>%</small></label>}</section>
        <button className="button reset" onClick={() => { setRecord(DEFAULT_RECORD); setMessage("Defaults restored."); }}>Restore defaults</button>
      </section>
      <aside className="results-column"><div className="results-header"><div><p className="eyebrow">YOUR WORKING NUMBERS</p><h2>Stitch plan</h2></div><span className="live-dot">Live</span></div>{validation.length > 0 && <div className="error-box" role="alert">{validation[0]}</div>}<div className="hero-result"><span>Target foot circumference</span><strong>{formatMeasurement(result.easedCircumferenceCm, unit)}</strong><small>{result.easePercent}% negative ease applied to {formatMeasurement(result.targetCircumferenceCm, unit)}</small></div><div className="metric-grid"><div className="metric"><span>Base stitches</span><strong>{result.baseStitches.toFixed(1)}</strong></div><div className="metric accent"><span>Rounded stitches</span><strong>{result.roundedStitches}</strong><small>{record.construction.ribbing} repeat</small></div></div><div className="derived-list"><ResultMetric label="Ankle" value={derived.ankleCircumference.value} unit={unit} source={derived.ankleCircumference.source} /><ResultMetric label="Heel height" value={derived.heelHeight.value} unit={unit} source={derived.heelHeight.source} /><ResultMetric label="Toe length" value={derived.toeLength.value} unit={unit} source={derived.toeLength.source} /></div><div className="section-results"><h3>Section counts</h3><div className="result-row"><span>Cuff <small>{result.sections.cuff.detail}</small></span><strong>{result.sections.cuff.stitches} sts</strong></div><div className="result-row"><span>Leg <small>{formatMeasurement(result.sections.leg.lengthCm, unit)} working length</small></span><strong>{result.sections.leg.stitches} sts</strong></div><div className="result-row"><span>Heel <small>{result.sections.heel.detail}</small></span><strong>{result.sections.heel.stitches} sts</strong></div><div className="result-row"><span>Foot <small>{formatMeasurement(result.sections.foot.lengthCm, unit)} working length</small></span><strong>{result.sections.foot.stitches} sts</strong></div><div className="result-row"><span>Toe <small>{result.sections.toe.detail}</small></span><strong>{result.sections.toe.finalStitches} sts</strong></div></div><div className="diagram"><svg viewBox="0 0 467 168" role="img" aria-labelledby="foot-guide-title foot-guide-description"><title id="foot-guide-title">Foot measurement guide</title><desc id="foot-guide-description">A foot outline with callouts for heel diagonal, ball circumference, and foot length.</desc><g className="diagram-callouts"><line x1="19" y1="72" x2="38" y2="72" /><text x="46" y="76">heel diagonal</text><line x1="330" y1="92" x2="349" y2="92" /><text x="357" y="96">ball circumference</text><line x1="365" y1="24" x2="385" y2="24" /><text x="393" y="28">foot length</text></g><path className="diagram-outline" d="M222 25c-19 0-31 18-32 43-1 24 8 54 26 60 19 6 42-5 48-25 6-20-2-54-17-68-8-7-16-10-25-10Z" /><text className="diagram-word" x="227" y="84" textAnchor="middle" transform="rotate(-12 227 84)">FOOT</text></svg></div></aside>
    </div>
  </main>;
}