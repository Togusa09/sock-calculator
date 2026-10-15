import { createContext } from "react";

interface IFeatureTogglecontext{
    enabledFeatures: string[],
    paidFeatureList: string[],
    paidFeaturesEnabled: boolean,
}

function splitFeatures(envVar: string | undefined) : string[]{
    if (envVar === undefined) return [];

    return envVar.split(',').filter(x => x !== undefined && x !== '');
}

export const FeatureToggleContext = createContext<IFeatureTogglecontext>({
    enabledFeatures: splitFeatures(process.env.FEATURES) || [] as string[],
    paidFeaturesEnabled: true, // Need to get from payment service
    paidFeatureList: splitFeatures(process.env.PAID_FEATURES) || [] as string[]
})