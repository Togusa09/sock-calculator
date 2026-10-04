// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { WizardTabs, type WizardTab } from "./WizardTabs";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const tabs: WizardTab[] = [
  { id: "a", step: "01", label: "A" },
  { id: "b", step: "02", label: "B", hasError: true },
  { id: "c", step: "03", label: "C" },
];

function render(onSelect: (id: string) => void, activeId = "a") {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    createRoot(container).render(
      <WizardTabs tabs={tabs} activeId={activeId} onSelect={onSelect} />,
    );
  });
  return container;
}

describe("WizardTabs", () => {
  it("marks the active tab and flags tabs with errors", () => {
    const container = render(vi.fn(), "b");
    const buttons = container.querySelectorAll('[role="tab"]');

    expect(buttons[1].getAttribute("aria-selected")).toBe("true");
    expect(buttons[0].getAttribute("aria-selected")).toBe("false");
    expect(
      buttons[1].querySelector('[aria-label="Needs attention"]'),
    ).not.toBeNull();
  });

  it("selects on click and moves with arrow keys, wrapping around", () => {
    const onSelect = vi.fn();
    const container = render(onSelect);
    const list = container.querySelector('[role="tablist"]') as HTMLElement;

    act(() => {
      (container.querySelectorAll('[role="tab"]')[2] as HTMLElement).click();
    });
    act(() => {
      list.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
      );
    });

    expect(onSelect).toHaveBeenNthCalledWith(1, "c");
    expect(onSelect).toHaveBeenNthCalledWith(2, "c");
  });
});
