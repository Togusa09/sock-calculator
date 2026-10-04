"use client";

import type { ReactNode } from "react";
import { WizardNav } from "@/src/components/WizardNav";

type Props = {
  id: string;
  active: boolean;
  desktopActive: boolean;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  children: ReactNode;
};

/** Stays mounted when inactive so child state (e.g. loaded saved items) survives tab changes. */
export function WizardPanel({
  id,
  active,
  desktopActive,
  onBack,
  onNext,
  nextLabel,
  children,
}: Props) {
  const className = [
    "wizard-panel",
    active ? "is-active" : "",
    desktopActive ? "is-desktop-active" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={className}
    >
      {children}
      <WizardNav onBack={onBack} onNext={onNext} nextLabel={nextLabel} />
    </div>
  );
}
