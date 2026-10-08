// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import CompactPage from "@/src/app/compact/page";
import { saveItem } from "@/src/lib/library";
import { DEFAULT_RECORD, DEFAULT_YARN_PROFILE } from "@/src/lib/domain";

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
  beforeEach(() => {
    window.localStorage.clear();
    document.body.innerHTML = "";
  });

  it("shows results once all four items are selected", async () => {
    const foot = saveItem("measurements", DEFAULT_RECORD.measurements, "F");
    const yarn = saveItem("yarnProfile", DEFAULT_YARN_PROFILE, "Y");
    const tension = saveItem(
      "tension",
      { ...DEFAULT_RECORD.tension, yarnProfileId: yarn.id },
      "T",
    );
    const cons = saveItem("construction", DEFAULT_RECORD.construction, "C");

    const container = document.createElement("div");
    document.body.appendChild(container);
    await act(async () => {
      createRoot(container).render(<CompactPage />);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    expect(container.querySelector(".compact-results")).toBeNull();
    expect(container.querySelector("details")).toBeNull();

    await act(async () => choose(container, 0, foot.id));
    await act(async () => choose(container, 1, yarn.id));
    await act(async () => choose(container, 2, tension.id));
    await act(async () => choose(container, 3, cons.id));

    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(4);
    expect(Array.from(details).some((d) => d.open)).toBe(false);
    expect(details[0].textContent).toContain("Foot length");
    expect(container.querySelector(".compact-results")).not.toBeNull();
    expect(container.querySelector("input")).toBeNull();
  });
});
