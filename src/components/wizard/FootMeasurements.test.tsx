import { fireEvent, render, screen } from "@testing-library/react-native";
import { DEFAULT_RECORD } from "@/lib/domain";
import { FootMeasurements } from "./FootMeasurements";

jest.mock("@/components/SavedItemsControl", () => ({
  SavedItemsControl: () => null,
}));

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

test("all foot measurement fields use responsive layouts", async () => {
  const onChange = jest.fn();
  await render(
    <FootMeasurements
      measurements={DEFAULT_RECORD.measurements}
      unit="metric"
      onChange={onChange}
    />,
  );
  await fireEvent.press(
    screen.getByRole("button", { name: /More measurements/ }),
  );

  for (const label of [
    "Foot length",
    "Ball circumference",
    "Heel diagonal",
    "Ankle circumference",
    "Heel height",
    "Instep circumference",
    "Toe length",
    "Low calf circumference",
    "High calf circumference",
  ]) {
    expect(screen.getByLabelText(`${label} (cm)`).parent).toHaveStyle({
      flexWrap: "wrap",
    });
    expect(screen.getByLabelText(label)).toHaveStyle({
      minWidth: 0,
      maxWidth: "100%",
    });
  }

  await fireEvent.changeText(screen.getByLabelText("Foot length"), "26");
  expect(onChange).toHaveBeenLastCalledWith({ footLengthCm: 26 });
  await fireEvent.changeText(screen.getByLabelText("Heel height"), "6");
  expect(onChange).toHaveBeenLastCalledWith({ heelHeightCm: 6 });
});
