import { ConfigEditPage } from "@/components/config/ConfigEditPage";
import { ConfigListPage } from "@/components/config/ConfigListPage";
import { saveItem } from "@/lib/library";
import { render, screen } from "@testing-library/react-native";
import { act, Suspense } from "react";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest"),
);

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Data = { size: number };

async function renderPage(element: React.ReactNode) {
  await act(async () => {
    render(<Suspense>{element}</Suspense>);
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
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

// beforeEach(() => {
//   window.localStorage.clear();
//   document.body.innerHTML = "";
// });

describe("config pages", () => {
  it("lists items with an edit link", async () => {
    const item = await saveItem("measurements", { size: 3 }, "Mine");
    await renderPage(
      <ConfigListPage<Data>
        type="measurements"
        title="Foot sizes"
        basePath="/config/foot-sizes"
        emptyMessage="none"
        summarize={(d) => `size ${d.size}`}
      />,
    );

    screen.getByText("Mine");
    screen.getByText("size 3");
    // expect(container.textContent).toContain("Mine");
    // expect(container.textContent).toContain("size 3");
    const editLink = screen.getByTestId(`edit-link-${item.id}`);
    expect(editLink).not.toBeNull();
    expect(editLink).toHaveProp(
      "href",
      `/config/foot-sizes/edit?id=${item.id}`,
    );
  });

  it("shows not found with a link to the index for an unknown id", async () => {
    await renderPage(editPage("missing"));

    const heading = screen.getByTestId("config-heading");
    expect(heading).toHaveTextContent("Foot size not found");

    const link = screen.getByTestId("config-index-link");
    expect(link).toHaveProp("href", "/config/foot-sizes");

    // expect(container.textContent).toContain("Foot size not found");
    // expect(
    //   container.querySelector('a[href="/config/foot-sizes"]'),
    // ).not.toBeNull();
  });

  // it("saves edits and renames in place", async () => {
  //   const item = await saveItem("measurements", { size: 3 }, "Mine");
  //   const container = await renderPage(editPage(item.id));
  //   // const inputs = container.querySelectorAll("input");
  //   const setValue = Object.getOwnPropertyDescriptor(
  //     HTMLInputElement.prototype,
  //     "value",
  //   )!.set!;

  //   await act(async () => {
  //     setValue.call(inputs[0], "Renamed");
  //     inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
  //     setValue.call(inputs[1], "9");
  //     inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
  //   });
  //   await act(async () => {
  //     (
  //       Array.from(container.querySelectorAll("button")).find(
  //         (b) => b.textContent === "Save",
  //       ) as HTMLElement
  //     ).click();
  //   });

  //   const items = await listItems<Data>("measurements");
  //   expect(items).toHaveLength(1);
  //   expect(items[0]).toMatchObject({
  //     id: item.id,
  //     name: "Renamed",
  //     data: { size: 9 },
  //   });
  // });
});
