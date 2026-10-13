import { createContext } from "react";

interface IFeatureTogglecontext{
    enabledFeatures: string[],
    publicFeatureSet: number,
}

function splitFeatures(envVar: string | undefined) : string[]{
    if (envVar === undefined) return [];

    return envVar.split(',').filter(x => x !== undefined && x !== '');
}

export const FeatureToggleContext = createContext<IFeatureTogglecontext>({
    enabledFeatures: splitFeatures(process.env.FEATURES) || [] as string[],
    publicFeatureSet: Number(process.env.FEATURE_SET)
})