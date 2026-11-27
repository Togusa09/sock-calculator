import { saveItem } from "@/lib/library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { SavedItemsControl } from "./SavedItemsControl";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(async () => {
  await AsyncStorage.clear();
});

test("opens saved items in a modal and closes it after loading", async () => {
  const item = await saveItem("measurements", { footLengthCm: 25 }, "Pair");
  const onLoad = jest.fn();

  await render(
    <SavedItemsControl
      type="measurements"
      data={{ footLengthCm: 24 }}
      defaultData={{ footLengthCm: 0 }}
      onLoad={onLoad}
    />,
  );

  expect(screen.queryByLabelText("Name to save as")).toBeNull();
  await fireEvent.press(screen.getByTestId("manage-existing-button"));

  expect(await screen.findByLabelText("Name to save as")).toBeTruthy();
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Load Pair" })).toBeTruthy(),
  );

  await fireEvent.press(screen.getByRole("button", { name: "Load Pair" }));

  expect(onLoad).toHaveBeenCalledWith(item.data, item);
  expect(screen.queryByLabelText("Name to save as")).toBeNull();
});

test("closes the saved items modal with its close button", async () => {
  await render(
    <SavedItemsControl
      type="project"
      data={{}}
      defaultData={{}}
      onLoad={jest.fn()}
    />,
  );

  await fireEvent.press(screen.getByTestId("manage-existing-button"));
  expect(await screen.findByLabelText("Name to save as")).toBeTruthy();

  await fireEvent.press(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByLabelText("Name to save as")).toBeNull();
});
