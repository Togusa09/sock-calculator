import { useContext } from "react"
import { FeatureToggleContext } from "../context/FeatureToggleContext"

export const useFeatureToggle = () => {
    const {enabledFeatures, publicFeatureSet} = useContext(FeatureToggleContext);
    
    function isEnabled(featureName: string, featureSet: number){
        return enabledFeatures.includes(featureName) && featureSet == publicFeatureSet;
    }

    return [ isEnabled ];
}