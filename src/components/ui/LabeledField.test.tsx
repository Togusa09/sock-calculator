import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import LabeledField from "./LabeledField";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("LabeledField", () => {
  test("renders label and arbitrary control", async () => {
    await render(
      <LabeledField label="Weight">
        <Text>control</Text>
      </LabeledField>,
    );
    expect(screen.getByText("Weight")).toBeTruthy();
    expect(screen.getByText("control")).toBeTruthy();
  });

  test("shows required marker and error message", async () => {
    await render(
      <LabeledField label="Length" required error="Too short">
        <Text>control</Text>
      </LabeledField>,
    );
    expect(screen.getByText("*", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByText("Too short")).toBeTruthy();
  });
});
