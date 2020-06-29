import { AbcApi, AbcResult } from "../..";
import { AbcRequestCommand, IAbcOptions, IAbcQueryDefinition, IGeneralizedFiremodelQuery, IGeneralizedQuery } from "../../../types";
import { Model } from "firemodel";
/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
export declare function generalizedQuery<T extends Model>(queryDefn: IAbcQueryDefinition<T>, command: AbcRequestCommand, dexieQuery: IGeneralizedQuery<T>, firemodelQuery: IGeneralizedFiremodelQuery<T>, ctx: AbcApi<T>, options: IAbcOptions<T>): Promise<AbcResult<T>>;
