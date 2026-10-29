import { useFeatureToggle } from "@/hooks/UseFeatureToggle";
import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { FeatureToggleContext } from "../context/FeatureToggleContext";
import { FeatureToggle } from "./FeatureToggle";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("FeatureToggle", () => {
  test("renders children when feature is enabled", async () => {
    await render(
      <FeatureToggleContext.Provider
        value={{ enabledFeatures: ["beta-feature"] }}
      >
        <FeatureToggle feature="beta-feature">
          <Text testID="content">Feature Active</Text>
        </FeatureToggle>
      </FeatureToggleContext.Provider>,
    );

    const contentText = screen.getByText(/Feature Active/);
    expect(contentText).toBeOnTheScreen();
  });

  it("renders nothing when feature is not enabled and no fallback provided", async () => {
    await act(async () => {
      await render(
        <FeatureToggleContext.Provider value={{ enabledFeatures: [] }}>
          <FeatureToggle feature="beta-feature">
            <Text testID="content">Feature Active</Text>
          </FeatureToggle>
        </FeatureToggleContext.Provider>,
      );
    });

    const content = screen.queryByTestId("content");
    expect(content).toBeNull();
  });

  it("renders fallback when feature is not enabled", async () => {
    await act(async () => {
      await render(
        <FeatureToggleContext.Provider value={{ enabledFeatures: [] }}>
          <FeatureToggle
            feature="beta-feature"
            fallback={<Text testID="fallback">Feature Disabled</Text>}
          >
            <Text testID="content">Feature Active</Text>
          </FeatureToggle>
        </FeatureToggleContext.Provider>,
      );
    });

    const content = screen.queryByTestId("content");
    expect(content).toBeNull();

    const fallback = screen.queryByTestId("fallback");
    expect(fallback).toBeOnTheScreen();
  });
});

describe("useFeatureToggle", () => {
  it("returns isEnabled function checking features", async () => {
    let isEnabledFn: ((feature: string) => boolean) | null = null;

    function TestComponent() {
      const [isEnabled] = useFeatureToggle();
      isEnabledFn = isEnabled;
      return null;
    }

    await act(async () => {
      await render(
        <FeatureToggleContext.Provider
          value={{ enabledFeatures: ["feature-a", "feature-b"] }}
        >
          <TestComponent />
        </FeatureToggleContext.Provider>,
      );
    });

    expect(isEnabledFn).not.toBeNull();
    expect(isEnabledFn!("feature-a")).toBe(true);
    expect(isEnabledFn!("feature-b")).toBe(true);
    expect(isEnabledFn!("feature-c")).toBe(false);
  });
});
