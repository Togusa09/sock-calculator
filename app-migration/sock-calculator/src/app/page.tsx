import { Construction } from "@/components/Construction";
import { FootMeasurements } from "@/components/FootMeasurements";
import { ResultsPanel } from "@/components/ResultsPanel";
import {
  SavedItemsControl,
  type LoadedItemInfo,
} from "@/components/SavedItemsControl";
import { WizardPanel } from "@/components/WizardPanel";
import { WizardTabs, type WizardTab } from "@/components/WizardTabs";
import { YarnProfile } from "@/components/YarnProfile";
import { YarnTension } from "@/components/YarnTension";
import { calculateStitches } from "@/lib/calculations";
import { DEFAULT_RECORD, DEFAULT_YARN_PROFILE } from "@/lib/domain";
import { validateRecord } from "@/lib/validation";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

          <TouchableOpacity
            style={[styles.button, styles.reset]}
            onPress={() => {
              setRecord(DEFAULT_RECORD);
              setMessage("Defaults restored.");
            }}
          >
            <Text style={styles.resetText}>Restore defaults</Text>
          </TouchableOpacity>
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
    backgroundColor: "#f4f1ea",
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
    borderColor: "#ddd8ca",
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
    borderColor: "#ddd8ca",
  },
  resetText: {
    color: "#77746b",
    fontSize: 12,
    fontWeight: "700",
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
    borderColor: "#ddd8ca",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#77746b",
  },
});
