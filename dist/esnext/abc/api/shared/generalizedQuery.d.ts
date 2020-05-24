import { AbcApi, AbcRequestCommand, AbcResult, IAbcOptions, IAbcQueryDefinition } from "../../../private";
import { Model } from "firemodel";
export interface IGeneralizedQuery<T extends Model> {
    (): Promise<T[]>;
}
/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
export declare function generalizedQuery<T extends Model>(queryDefn: IAbcQueryDefinition<T>, command: AbcRequestCommand, dexieQuery: IGeneralizedQuery<T>, firemodelQuery: IGeneralizedQuery<T>, ctx: AbcApi<T>, options: IAbcOptions<T>): Promise<AbcResult<T>>;
