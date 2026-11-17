import { fireEvent, render, screen } from "@testing-library/react-native";
import { act, useState } from "react";
import { Platform, Text, TextInput } from "react-native";
import {
  Wizard,
  WizardStep,
  type WizardDestination,
  type WizardStepInfo,
} from "./Wizard";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function EditableStep() {
  const [value, setValue] = useState("");
  return (
    <TextInput
      accessibilityLabel="Measurement"
      value={value}
      onChangeText={setValue}
    />
  );
}

function ExampleWizard({
  canAdvance,
  onFinish,
}: {
  canAdvance?: (
    current: WizardStepInfo,
    destination: WizardDestination,
  ) => boolean;
  onFinish?: () => void;
}) {
  return (
    <Wizard canAdvance={canAdvance} onFinish={onFinish}>
      <WizardStep id="first" label="First" component={<EditableStep />} />
      <WizardStep
        id="second"
        label="Second"
        component={<Text>Second content</Text>}
      />
      <WizardStep
        id="third"
        label="Third"
        component={<Text>Third content</Text>}
      />
    </Wizard>
  );
}

function touchEvent(
  previousX: number,
  previousY: number,
  x: number,
  y: number,
  time: number,
) {
  return {
    nativeEvent: { touches: [{}] },
    touchHistory: {
      numberActiveTouches: 1,
      indexOfSingleActiveTouch: 0,
      mostRecentTimeStamp: time,
      touchBank: [
        {
          touchActive: true,
          previousPageX: previousX,
          previousPageY: previousY,
          currentPageX: x,
          currentPageY: y,
          currentTimeStamp: time,
        },
      ],
    },
  };
}

function beginGesture(dx: number, dy: number) {
  const content = screen.getByTestId("wizard-content");
  const start = touchEvent(0, 0, 0, 0, 1);
  const move = touchEvent(0, 0, dx, dy, 2);
  content.props.onStartShouldSetResponderCapture(start);
  content.props.onMoveShouldSetResponderCapture(move);
  return { content, move };
}

async function swipe(dx: number) {
  const { content, move } = beginGesture(Math.sign(dx) * 15, 0);
  expect(content.props.onMoveShouldSetResponder(move)).toBe(true);
  content.props.onResponderGrant(move);
  content.props.onResponderMove(
    touchEvent(Math.sign(dx) * 15, 0, Math.sign(dx) * 15 + dx, 0, 3),
  );
  await act(async () => content.props.onResponderRelease(move));
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Wizard", () => {
  it("navigates with buttons, preserves local state, and exposes only the active step", async () => {
    jest.replaceProperty(Platform, "OS", "web");
    await render(<ExampleWizard />);

    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Step 1: First", selected: true }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Step 2: Second" }),
    ).toBeDisabled();
    expect(screen.queryByText("Second content")).toBeNull();
    expect(
      screen.getByTestId("wizard-content").props.onResponderMove,
    ).toBeUndefined();

    await fireEvent.changeText(screen.getByLabelText("Measurement"), "24");
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2 of 3: Second")).toBeTruthy();
    expect(screen.queryByLabelText("Measurement")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText("Measurement")).toHaveDisplayValue("24");
  });

  it("guards forward navigation and Finish while allowing backward navigation", async () => {
    const canAdvance = jest.fn(() => false);
    const onFinish = jest.fn();
    await render(<ExampleWizard canAdvance={canAdvance} onFinish={onFinish} />);

    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
    expect(canAdvance).toHaveBeenLastCalledWith(
      { id: "first", label: "First", index: 0 },
      { type: "step", step: { id: "second", label: "Second", index: 1 } },
    );

    canAdvance.mockReturnValue(true);
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    canAdvance.mockReturnValue(false);
    await fireEvent.press(screen.getByRole("button", { name: "Finish" }));
    expect(canAdvance).toHaveBeenLastCalledWith(
      { id: "third", label: "Third", index: 2 },
      { type: "finish" },
    );
    expect(onFinish).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("Step 2 of 3: Second")).toBeTruthy();
    canAdvance.mockReturnValue(true);
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    await fireEvent.press(screen.getByRole("button", { name: "Finish" }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("only allows selecting visited steps and guards jumps forward", async () => {
    const canAdvance = jest.fn(() => true);
    await render(<ExampleWizard canAdvance={canAdvance} />);
    await fireEvent.press(
      screen.getByRole("button", { name: "Step 3: Third" }),
    );
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    await fireEvent.press(
      screen.getByRole("button", { name: "Step 1: First" }),
    );
    canAdvance.mockReturnValue(false);
    await fireEvent.press(
      screen.getByRole("button", { name: "Step 3: Third" }),
    );
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
    expect(canAdvance).toHaveBeenLastCalledWith(
      { id: "first", label: "First", index: 0 },
      { type: "step", step: { id: "third", label: "Third", index: 2 } },
    );
    canAdvance.mockReturnValue(true);
    await fireEvent.press(
      screen.getByRole("button", { name: "Step 3: Third" }),
    );
    expect(screen.getByText("Step 3 of 3: Third")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Finish" })).toBeNull();
  });

  it("uses guarded native swipes without capturing vertical gestures or canceled swipes", async () => {
    jest.replaceProperty(Platform, "OS", "ios");
    const canAdvance = jest.fn(() => false);
    await render(<ExampleWizard canAdvance={canAdvance} />);

    const vertical = beginGesture(4, 30);
    expect(vertical.content.props.onMoveShouldSetResponder(vertical.move)).toBe(
      false,
    );
    const horizontal = beginGesture(-15, 0);
    expect(
      horizontal.content.props.onMoveShouldSetResponder(horizontal.move),
    ).toBe(true);
    horizontal.content.props.onResponderGrant(horizontal.move);
    horizontal.content.props.onResponderMove(touchEvent(-15, 0, -90, 0, 3));
    horizontal.content.props.onResponderTerminate(horizontal.move);
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
    await swipe(-60);
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
    canAdvance.mockReturnValue(true);
    await swipe(-60);
    expect(screen.getByText("Step 2 of 3: Second")).toBeTruthy();
    canAdvance.mockReturnValue(false);
    await swipe(60);
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
  });

  it("ignores short and multi-touch gestures and does not swipe past a boundary", async () => {
    jest.replaceProperty(Platform, "OS", "android");
    await render(<ExampleWizard />);
    await swipe(60);
    await swipe(-20);
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();

    const { content, move } = beginGesture(-15, 0);
    content.props.onResponderGrant(move);
    const secondTouch = touchEvent(-15, 0, -20, 0, 3);
    secondTouch.touchHistory.numberActiveTouches = 2;
    content.props.onResponderStart(secondTouch);
    content.props.onResponderMove(touchEvent(-15, 0, -90, 0, 4));
    await act(async () => content.props.onResponderRelease(move));
    expect(screen.getByText("Step 1 of 3: First")).toBeTruthy();
  });

  it("supports a single-step wizard with completion", async () => {
    const onFinish = jest.fn();
    await render(
      <Wizard onFinish={onFinish}>
        <WizardStep id="only" label="Only" component={<Text>Content</Text>} />
      </Wizard>,
    );
    expect(screen.getByText("Step 1 of 1: Only")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Finish" }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid and changing step definitions", async () => {
    await expect(render(<Wizard>{null}</Wizard>)).rejects.toThrow(
      "at least one",
    );
    await expect(
      render(
        <Wizard>
          <WizardStep id="same" label="One" component={<Text>One</Text>} />
          <WizardStep id="same" label="Two" component={<Text>Two</Text>} />
        </Wizard>,
      ),
    ).rejects.toThrow("unique nonempty id");
    const result = await render(
      <Wizard>
        <WizardStep id="first" label="First" component={<Text>First</Text>} />
      </Wizard>,
    );
    await expect(
      result.rerender(
        <Wizard>
          <WizardStep
            id="changed"
            label="Changed"
            component={<Text>Changed</Text>}
          />
        </Wizard>,
      ),
    ).rejects.toThrow("must remain stable");
  });
});
