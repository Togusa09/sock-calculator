import { render, screen } from "@testing-library/react-native";
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

function renderTabs(onSelect: (id: string) => void, activeId = "a") {
  return act(async () => {
    await render(
      <WizardTabs tabs={tabs} activeId={activeId} onSelect={onSelect} />,
    );
  });
}

describe("WizardTabs", () => {
  it("marks the active tab and flags tabs with errors", async () => {
    const container = await renderTabs(jest.fn(), "b");
    const buttons = screen.queryAllByRole("tab");

    expect(buttons[1].getAttribute("aria-selected")).toBe("true");
    expect(buttons[0].getAttribute("aria-selected")).toBe("false");
    expect(
      buttons[1].querySelector('[aria-label="Needs attention"]'),
    ).not.toBeNull();
  });

  it("selects on click and moves with arrow keys, wrapping around", async () => {
    const onSelect = jest.fn();
    const container = await renderTabs(onSelect);
    const list = screen.queryAllByRole("tablist") as HTMLElement;

    act(() => {
      (screen.queryAllByRole("tab")[2] as HTMLElement).click();
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
