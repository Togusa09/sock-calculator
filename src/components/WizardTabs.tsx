"use client";

import { useRef, type KeyboardEvent } from "react";

export type WizardTab = {
  id: string;
  label: string;
  step: string;
  hasError?: boolean;
  /** Only shown in the compact (mobile) layout. */
  mobileOnly?: boolean;
};

type Props = {
  tabs: WizardTab[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function WizardTabs({ tabs, activeId, onSelect }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const candidates = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ??
        [],
    ).filter((button) => window.getComputedStyle(button).display !== "none");
    const current = candidates.findIndex((b) => b.dataset.tabId === activeId);
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const next =
      candidates[
        (current + (forward ? 1 : -1) + candidates.length) % candidates.length
      ];
    if (!next) return;
    onSelect(next.dataset.tabId as string);
    next.focus();
  }

  return (
    <div
      ref={listRef}
      className="wizard-tabs"
      role="tablist"
      aria-label="Calculator sections"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            data-tab-id={tab.id}
            aria-selected={selected}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className={[
              "wizard-tab",
              selected ? "is-active" : "",
              tab.mobileOnly ? "mobile-only" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(tab.id)}
          >
            <span className="wizard-tab-step">{tab.step}</span>
            <span className="wizard-tab-label">{tab.label}</span>
            {tab.hasError && (
              <span
                className="wizard-tab-error"
                role="img"
                aria-label="Needs attention"
              >
                !
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
