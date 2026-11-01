import { FeatureToggle } from "@/components/FeatureToggle";
import { ImportExportData } from "@/components/ImportExportData";
import { ResultsPanel } from "@/components/ResultsPanel";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import { ClearButton } from "@/components/ui/ClearButton";
import {
  PlatformPicker,
  PlatformPickerItem,
} from "@/components/ui/PlatformPicker";
import { Construction } from "@/components/wizard/Construction";
import { FootMeasurements } from "@/components/wizard/FootMeasurements";
import { YarnProfile } from "@/components/wizard/YarnProfile";
import { YarnTension } from "@/components/wizard/YarnTension";
import { WizardPanel } from "@/components/WizardPanel";
import { WizardTabs, type WizardTab } from "@/components/WizardTabs";
import { calculateStitches } from "@/lib/calculations";
import {
  DEFAULT_RECORD,
  DEFAULT_YARN_PROFILE,
  DisplayUnit,
} from "@/lib/domain";
import { validateRecord } from "@/lib/validation";
import { palette } from "@/theme/colors";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
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
  const { width } = useWindowDimensions();
  const isWideScreen = width > 850;
  const titleSize = Math.min(76, Math.max(42, width * 0.06));
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
    { id: "results", step: "05", label: "Results", mobileOnly: true },
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
      contentContainerStyle={[
        styles.scrollContent,
        width <= 500 && styles.scrollContentNarrow,
      ]}
    >
      <View style={[styles.topbar, !isWideScreen && styles.topbarNarrow]}>
        <View style={styles.topbarLeft}>
          <Text style={styles.eyebrow}>FIELD NOTES / KNIT PLANNING</Text>
          <Text
            style={[
              styles.h1,
              { fontSize: titleSize, lineHeight: titleSize * 0.95 },
            ]}
          >
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

        <View
          style={[styles.topActions, !isWideScreen && styles.topActionsNarrow]}
        >
          <View style={styles.unitToggle}>
            <Text>Display</Text>
            {/* TODO: map platform picker child items from children instead of property */}
            <PlatformPicker
              selectedValue={unit}
              onValueChange={(value) =>
                updateRecord({ displayUnit: value as DisplayUnit })
              }
              items={displayUnits.map<PlatformPickerItem>((f) => ({
                label: f.label,
                value: f.value,
              }))}
            ></PlatformPicker>
          </View>
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
            <Link href="/config" asChild>
              <Pressable
                style={StyleSheet.flatten([
                  styles.button,
                  styles.secondaryButton,
                ])}
              >
                <Text style={styles.secondaryButtonText}>Configuration</Text>
              </Pressable>
            </Link>
          </FeatureToggle>

          <ImportExportData
            onImported={(data) => {
              console.log(data);
              setRecord(data);
            }}
            onError={() => {}}
            onExported={() => {}}
          />
          {/* 
          <Pressable style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Export JSON</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Import JSON</Text>
          </Pressable> */}
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

      <View style={[styles.workspace, !isWideScreen && styles.workspaceNarrow]}>
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
              !isWideScreen && styles.wizardResultsNarrow,
              !isWideScreen &&
                activeTab !== "results" &&
                styles.wizardResultsHidden,
              activeTab === "results" && styles.isActiveResults,
            ]}
          >
            <ResultsPanel result={result} unit={unit} validation={errors} />
          </View>
        )}
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>Sock calculator</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: palette.paper,
    width: "100%",
    maxWidth: 1320,
    alignSelf: "center",
  },
  scrollContent: {
    paddingHorizontal: "5%",
    paddingTop: 42,
    paddingBottom: 72,
  },
  scrollContentNarrow: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 50,
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
  topbarNarrow: {
    alignItems: "flex-start",
    flexDirection: "column",
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
  topActionsNarrow: {
    justifyContent: "flex-start",
  },
  notice: {
    backgroundColor: "#e4eee8",
    color: "#61766b",
    padding: 16,
    marginTop: 18,
    fontSize: 13,
  },
  workspace: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 28,
    gap: 28,
  },
  workspaceNarrow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 16,
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
    gap: 16,
  },
  button: {
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  wizardResults: {
    flex: 0.8,
    minWidth: 350,
  },
  wizardResultsNarrow: {
    flex: 1,
    width: "100%",
    minWidth: 0,
  },
  wizardResultsHidden: {
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
});
