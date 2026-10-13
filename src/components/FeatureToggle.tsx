import { ReactNode } from "react";
import { FeatureToggleContext } from "../context/FeatureToggleContext";

type Props = {
    children: ReactNode;
    enabledFeatures: string[],
    publicFeatureSet: number,
}

export function FeatureToggle({children, enabledFeatures, publicFeatureSet}: Props) {
    return (
        <FeatureToggleContext.Provider value={{enabledFeatures, publicFeatureSet}}>
            {children}
        </FeatureToggleContext.Provider>
    )
}