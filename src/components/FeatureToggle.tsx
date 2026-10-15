import { ReactNode, useContext } from "react";
import { useFeatureToggle } from "../hooks/UseFeatureToggle";

type Props = {
    feature: string,
    children: ReactNode;
}

export function FeatureToggle({feature, children}: Props){
    const [isEnabled, isPurchased] = useFeatureToggle();
    
    return (
        <>
            { isEnabled(feature) && isPurchased(feature) && children}
            { isEnabled(feature) && !isPurchased(feature) && 
            <>
                Buy Premium
            </>}
        </>)
}