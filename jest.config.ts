// import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { defineConfig } from "jest";

export default defineConfig({
  //   verbose: true,
  //   transformIgnorePatterns: [
  //     "node_modules/(?!@react-native-async-storage/)",
  //     "node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?)/)",
  //   ],
  preset: "jest-expo",
  setupFilesAfterEnv: ["./jest-setup.ts"],
  //   setupFiles: ["./jestSetup.ts"],
  //   transformIgnorePatterns: ["node_modules/(?!@react-native-async-storage/)"],
  //   transform: {},
});
