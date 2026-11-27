import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, screen } from "@testing-library/react-native";
import { act } from "react";
import Home from "..";

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

beforeEach(async () => {
  jest.useFakeTimers();
  await AsyncStorage.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("home page", () => {
  it("shows every section and the summary on one page without tabs", async () => {
    await act(async () => {
      render(<Home />);
      await jest.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByText(/Foot measurements/)).toBeTruthy();
    // expect(screen.getByText(/Yarn profile/)).toBeTruthy();
    // expect(screen.getByText(/Yarn tension/)).toBeTruthy();
    // expect(screen.getByText(/Construction/)).toBeTruthy();
    // expect(screen.getByText("Stitch plan")).toBeTruthy();
    // expect(screen.queryByTestId("wizard-tabs")).toBeNull();
  });
});
