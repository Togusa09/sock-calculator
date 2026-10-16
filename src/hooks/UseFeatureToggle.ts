import { useContext } from "react";
import { FeatureToggleContext } from "../context/FeatureToggleContext";

export const useFeatureToggle = () => {
  const { enabledFeatures } = useContext(FeatureToggleContext);

  function isEnabled(featureName: string): boolean {
    return enabledFeatures.includes(featureName);
  }

  return [isEnabled] as const;
};
