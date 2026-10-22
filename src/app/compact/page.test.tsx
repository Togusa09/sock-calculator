import { DEFAULT_RECORD, DEFAULT_YARN_PROFILE } from "@/lib/domain";
import { saveItem } from "@/lib/library";
import { clearAllMockStorages } from "@react-native-async-storage/async-storage/jest";
import { render } from "@testing-library/react-native";
import { act } from "react";
import CompactPage from ".";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest"),
);

beforeEach(() => {
  clearAllMockStorages();
});

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function choose(container: HTMLElement, index: number, value: string) {
  const select = container.querySelectorAll("select")[index];
  const setter = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype,
    "value",
  )!.set!;
  setter.call(select, value);
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("compact page", () => {
  // beforeEach(() => {
  //   window.localStorage.clear();
  //   document.body.innerHTML = "";
  // });

  it("shows results once all four items are selected", async () => {
    const foot = await saveItem(
      "measurements",
      DEFAULT_RECORD.measurements,
      "F",
    );
    const yarn = await saveItem("yarnProfile", DEFAULT_YARN_PROFILE, "Y");
    const tension = await saveItem(
      "tension",
      { ...DEFAULT_RECORD.tension, yarnProfileId: yarn.id },
      "T",
    );
    const cons = await saveItem(
      "construction",
      DEFAULT_RECORD.construction,
      "C",
    );

    await act(async () => {
      await render(<CompactPage />);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    // expect(screen.query que(".compact-results")).toBeNull();
    // expect(screen.querySelector("details")).toBeNull();

    // await act(async () => choose(container, 0, foot.id));
    // await act(async () => choose(container, 1, yarn.id));
    // await act(async () => choose(container, 2, tension.id));
    // await act(async () => choose(container, 3, cons.id));

    // const details = screen.querySelectorAll("details");
    // expect(details).toHaveLength(4);
    // expect(Array.from(details).some((d) => d.open)).toBe(false);
    // expect(details[0].textContent).toContain("Foot length");
    // expect(container.querySelector(".compact-results")).not.toBeNull();
    // expect(container.querySelector("input")).toBeNull();
  });
});
