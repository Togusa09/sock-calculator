import { render, screen } from "@testing-library/react-native";
import { act } from "react";
import * as ReactNative from "react-native";
import { DEFAULT_YARN_PROFILE } from "@/lib/domain";
import { WizardTabs, type WizardTab } from "./WizardTabs";
import { MaterialMixEditor } from "./wizard/MaterialMixEditor";
import { YarnProfile } from "./wizard/YarnProfile";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const tabs: WizardTab[] = [
  { id: "a", step: "01", label: "A" },
  { id: "b", step: "02", label: "B", hasError: true },
  { id: "c", step: "03", label: "C" },
  { id: "results", step: "05", label: "Results", mobileOnly: true },
];

function setViewportWidth(width: number) {
  const metrics = { width, height: 768, scale: 1, fontScale: 1 };
  ReactNative.Dimensions.set({ window: metrics, screen: metrics });
}

function renderTabs(onSelect: (id: string) => void, activeId = "a") {
  setViewportWidth(1024);
  return act(async () => {
    await render(
      <WizardTabs tabs={tabs} activeId={activeId} onSelect={onSelect} />,
    );
  });
}

describe("WizardTabs", () => {
  it("marks the active tab and flags tabs with errors", async () => {
    await renderTabs(jest.fn(), "b");

    const t = screen.getByTestId("a");
    const t2 = screen.getByTestId("b");

    expect(t).toBeOnTheScreen();
    expect(t2).toBeOnTheScreen();
    expect(
      ReactNative.StyleSheet.flatten(
        screen.getByTestId("wizard-tabs").props.style,
      ),
    ).toMatchObject({
      width: 140,
      flexGrow: 0,
      flexShrink: 0,
    });
    expect(screen.queryByTestId("results")).toBeNull();
  });

  it("shows mobile-only tabs on compact screens", async () => {
    setViewportWidth(850);
    await act(async () => {
      await render(
        <WizardTabs tabs={tabs} activeId="a" onSelect={jest.fn()} />,
      );
    });

    expect(screen.getByTestId("results")).toBeOnTheScreen();
  });

  it("keeps yarn profile fields flexible at narrow widths", async () => {
    setViewportWidth(503);
    await act(async () => {
      await render(
        <YarnProfile
          profile={DEFAULT_YARN_PROFILE}
          onChange={jest.fn()}
          onSelect={jest.fn()}
        />,
      );
    });

    for (const testId of ["yarn-manufacturer-field", "yarn-weight-field"]) {
      expect(
        ReactNative.StyleSheet.flatten(screen.getByTestId(testId).props.style),
      ).toMatchObject({
        flex: 1,
        minWidth: 0,
      });
    }
  });

  it("allows material inputs to shrink within their row", async () => {
    await act(async () => {
      await render(
        <MaterialMixEditor
          materials={[{ material: "Wool", percent: 100 }]}
          onChange={jest.fn()}
        />,
      );
    });

    expect(
      ReactNative.StyleSheet.flatten(
        screen.getByPlaceholderText("Material name").props.style,
      ),
    ).toMatchObject({ minWidth: 0 });
    expect(
      ReactNative.StyleSheet.flatten(
        screen.getByPlaceholderText("0").props.style,
      ),
    ).toMatchObject({ minWidth: 0 });
  });
});

// describe("WizardTabs", () => {
//   it("marks the active tab and flags tabs with errors", async () => {
//     const container = await renderTabs(jest.fn(), "b");
//     const buttons = screen.queryAllByRole("tab");

//     var t = screen.getByTestId("a");
//     var t2 = screen.getByTestId("b");

//     expect(buttons[1].getAttribute("aria-selected")).toBe("true");
//     expect(buttons[0].getAttribute("aria-selected")).toBe("false");
//     expect(
//       buttons[1].querySelector('[aria-label="Needs attention"]'),
//     ).not.toBeNull();
//   });

//   it("selects on click and moves with arrow keys, wrapping around", async () => {
//     const onSelect = jest.fn();
//     const container = await renderTabs(onSelect);
//     const list = screen.queryAllByRole("tablist") as HTMLElement;

//     act(() => {
//       (screen.queryAllByRole("tab")[2] as HTMLElement).click();
//     });
//     act(() => {
//       list.dispatchEvent(
//         new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
//       );
//     });

//     expect(onSelect).toHaveBeenNthCalledWith(1, "c");
//     expect(onSelect).toHaveBeenNthCalledWith(2, "c");
//   });
// });
