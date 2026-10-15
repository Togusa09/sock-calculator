import { useContext } from "react"
import { FeatureToggleContext } from "../context/FeatureToggleContext"

export const useFeatureToggle = () => {
    const {enabledFeatures, paidFeatureList, paidFeaturesEnabled } = useContext(FeatureToggleContext);
    
    function isEnabled(featureName: string){
        return enabledFeatures.includes(featureName);
    }

    function isPurchased(featureName: string){
        return !paidFeatureList.includes(featureName) &&
            (paidFeaturesEnabled && paidFeatureList.includes(featureName));
    }

    return [ isEnabled, isPurchased ];
}