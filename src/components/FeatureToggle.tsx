import { useFeatureToggle } from "@/hooks/UseFeatureToggle";
import { type ReactNode } from "react";

export interface FeatureToggleProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureToggle({
  feature,
  children,
  fallback = null,
}: FeatureToggleProps) {
  const [isEnabled] = useFeatureToggle();

  if (!isEnabled(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
