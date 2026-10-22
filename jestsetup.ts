/* eslint-disable no-undef */
import "react-native";

// Use require inline to avoid module scope compilation issues in TypeScript
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
