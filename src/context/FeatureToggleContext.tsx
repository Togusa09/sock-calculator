import { createContext } from "react";

export interface FeatureToggleContextType {
  enabledFeatures: string[];
}

function splitFeatures(envVar: string | undefined): string[] {
  if (envVar === undefined) return [];

  return envVar
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

export const FeatureToggleContext = createContext<FeatureToggleContextType>({
  enabledFeatures: splitFeatures(process.env.NEXT_PUBLIC_FEATURES),
});
