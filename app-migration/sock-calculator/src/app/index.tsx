import { Construction } from "@/components/Construction";
import { FeatureToggle } from "@/components/FeatureToggle";
import { FootMeasurements } from "@/components/FootMeasurements";
import { ResultsPanel } from "@/components/ResultsPanel";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import { ClearButton } from "@/components/ui/ClearButton";
import { WizardPanel } from "@/components/WizardPanel";
import { WizardTabs, type WizardTab } from "@/components/WizardTabs";
import { YarnProfile } from "@/components/YarnProfile";
import { YarnTension } from "@/components/YarnTension";
import { calculateStitches } from "@/lib/calculations";
import {
  DEFAULT_RECORD,
  DEFAULT_YARN_PROFILE,
  DisplayUnit,
} from "@/lib/domain";
import { validateRecord } from "@/lib/validation";
import { palette } from "@/theme/colors";
import { Picker } from "@expo/ui";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDataPersistence } from "../hooks/UseDataPersistence";

type SectionId = "measurements" | "yarn" | "tension" | "construction";
type TabId = SectionId | "results";

const SECTION_ORDER: SectionId[] = [
  "measurements",
  "yarn",
  "tension",
  "construction",
];

const displayUnits = [
  { label: "Metric", value: "metric" },
  { label: "Imperial", value: "imperial" },
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
    { id: "results", step: "05", label: "Results", mobileOnly: false },
  ];

  function selectTab(id: string) {
    setActiveTab(id as TabId);
    if (id !== "results") setLastSection(id as SectionId);
  }

  function stepFrom(section: SectionId, offset: number) {
    return SECTION_ORDER[SECTION_ORDER.indexOf(section) + offset];
  }

  const desktopSection = activeTab === "results" ? lastSection : activeTab;

  function panel(section: SectionId, children: React.ReactNode) {
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

  return (
    <ScrollView
      style={styles.appShell}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <Text style={styles.eyebrow}>FIELD NOTES / KNIT PLANNING</Text>
          <Text style={styles.h1}>
            Sock calculator
            {loadedItem && (
              <Text style={styles.loadedItemName}>
                {" "}
                — {loadedItem.name}
                {loadedItem.dirty ? " (edited)" : ""}
              </Text>
            )}
          </Text>
          <Text style={styles.intro}>
            A calm starting point for a better-fitting pair. Enter the
            essentials and the construction math stays visible.
          </Text>
        </View>

        <View style={styles.topActions}>
          <View style={styles.unitToggle}>
            <Text>Display</Text>
            {/* Note: Replace with a React Native Picker or custom selector component for display unit */}

            <Picker
              selectedValue={unit}
              onValueChange={(value) =>
                updateRecord({ displayUnit: value as DisplayUnit })
              }
              appearance="wheel"
            >
              {displayUnits.map((f) => (
                <Picker.Item key={f.value} label={f.label} value={f.value} />
              ))}
            </Picker>
          </View>
          {/* <label className="unit-toggle">
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
          </label> */}
          <SavedItemsControl
            type="project"
            data={record}
            defaultData={DEFAULT_RECORD}
            onLoad={(loaded) => {
              const validationErrors = validateRecord(loaded);
              if (validationErrors.length > 0) {
                setMessage(validationErrors[0]);
                return;
              }
              setRecord(loaded);
              setMessage("Project loaded.");
            }}
            onLoadedItemChange={setLoadedItem}
          />

          <FeatureToggle feature="config">
            <Link className="button secondary" href="/config">
              Configuration
            </Link>
          </FeatureToggle>

          <Pressable style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Export JSON</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Import JSON</Text>
          </Pressable>
          {/* <button
            className="button secondary"
            // onClick={exportRecord}
          >
            Export JSON
          </button>
          <button
            className="button secondary"
            // onClick={() => importRef.current?.click()}
          >
            Import JSON
          </button>
          <input
            // ref={importRef}
            type="file"
            accept="application/json"
            hidden
            // onChange={importRecord}
          /> */}
        </View>
      </View>

      {message !== "" && (
        <Text style={styles.notice} accessibilityRole="text">
          {message}
        </Text>
      )}

      <View style={styles.workspace}>
        <WizardTabs tabs={tabs} activeId={activeTab} onSelect={selectTab} />

        <View style={styles.formColumn}>
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
          <ClearButton
            onPress={() => {
              setRecord(DEFAULT_RECORD);
              setMessage("Defaults restored.");
            }}
          >
            Restore defaults
          </ClearButton>
        </View>

        {(activeTab === "results" || desktopSection) && (
          <View
            style={[
              styles.wizardResults,
              activeTab === "results" && styles.isActiveResults,
            ]}
          >
            <ResultsPanel result={result} unit={unit} validation={errors} />
          </View>
        )}
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>Sock calculator STd</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  scrollContent: {
    paddingHorizontal: "5%",
    paddingTop: 42,
    paddingBottom: 72,
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 32,
    borderBottomWidth: 1,
    borderColor: palette.border,
    paddingBottom: 32,
    flexWrap: "wrap",
  },
  topbarLeft: {
    flex: 2,
    minWidth: 280,
  },
  eyebrow: {
    color: "#c75b36",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.96,
    marginBottom: 10,
  },
  h1: {
    fontFamily: "Georgia",
    fontSize: 48,
    fontWeight: "400",
    color: "#24231f",
    lineHeight: 48,
    marginBottom: 18,
  },
  loadedItemName: {
    color: "#77746b",
    fontWeight: "400",
    fontSize: 18,
  },
  intro: {
    color: "#77746b",
    maxWidth: 470,
    lineHeight: 22,
    fontSize: 14,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
  },
  notice: {
    backgroundColor: "#e4eee8",
    color: "#61766b",
    padding: 16,
    marginTop: 18,
    fontSize: 13,
  },
  workspace: {
    marginTop: 28,
    gap: 28,
  },
  formColumn: {
    gap: 16,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  reset: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.border,
  },
  wizardResults: {
    display: "none",
  },
  isActiveResults: {
    display: "flex",
  },
  pageFooter: {
    marginTop: 48,
    paddingTop: 24,
    borderTopWidth: 1,
    borderColor: palette.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#77746b",
  },
  secondaryButton: {
    backgroundColor: "#24231f", // --ink
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.48,
    color: palette.panel,
  },
  unitToggle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    color: palette.muted,
    fontSize: 13,
  },
  unitToggleSelect: {
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: palette.headingBorder,
    borderRadius: 0,
    color: palette.textPrimary,
  },
  pickerNative: {
    width: "100%",
    height: 40,
    backgroundColor: "transparent",
    // 2. Remove standard web browser default borders
    borderWidth: 0,
  },
});
