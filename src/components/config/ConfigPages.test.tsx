// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act, Suspense } from "react";
import { ConfigEditPage } from "@/src/components/config/ConfigEditPage";
import { ConfigListPage } from "@/src/components/config/ConfigListPage";
import { saveItem, listItems } from "@/src/lib/library";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<"a">) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Data = { size: number };

async function render(element: React.ReactNode) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  await act(async () => {
    createRoot(container).render(<Suspense>{element}</Suspense>);
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  return container;
}

function editPage(id: string) {
  return (
    <ConfigEditPage<Data>
      type="measurements"
      id={id}
      entityLabel="Foot size"
      indexHref="/config/foot-sizes"
      indexLabel="Go to foot sizes"
      validate={() => []}
      renderFields={(data, onChange) => (
        <input
          aria-label="size"
          type="number"
          value={data.size}
          onChange={(e) => onChange({ size: Number(e.target.value) })}
        />
      )}
    />
  );
}

beforeEach(() => {
  window.localStorage.clear();
  document.body.innerHTML = "";
});

describe("config pages", () => {
  it("lists items with an edit link", async () => {
    const item = saveItem("measurements", { size: 3 }, "Mine");
    const container = await render(
      <ConfigListPage<Data>
        type="measurements"
        title="Foot sizes"
        basePath="/config/foot-sizes"
        emptyMessage="none"
        summarize={(d) => `size ${d.size}`}
      />,
    );

    expect(container.textContent).toContain("Mine");
    expect(container.textContent).toContain("size 3");
    expect(
      container.querySelector(
        `a[href="/config/foot-sizes/edit?id=${item.id}"]`,
      ),
    ).not.toBeNull();
  });

  it("shows not found with a link to the index for an unknown id", async () => {
    const container = await render(editPage("missing"));

    expect(container.textContent).toContain("Foot size not found");
    expect(
      container.querySelector('a[href="/config/foot-sizes"]'),
    ).not.toBeNull();
  });

  it("saves edits and renames in place", async () => {
    const item = saveItem("measurements", { size: 3 }, "Mine");
    const container = await render(editPage(item.id));
    const inputs = container.querySelectorAll("input");
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;

    await act(async () => {
      setValue.call(inputs[0], "Renamed");
      inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
      setValue.call(inputs[1], "9");
      inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      (
        Array.from(container.querySelectorAll("button")).find(
          (b) => b.textContent === "Save",
        ) as HTMLElement
      ).click();
    });

    const items = listItems<Data>("measurements");
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: item.id,
      name: "Renamed",
      data: { size: 9 },
    });
  });
});
