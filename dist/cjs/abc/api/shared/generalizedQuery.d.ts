import { AbcRequestCommand, IAbcQueryDefinition, IAbcOptions } from "../../../types";
import { AbcApi } from "../AbcApi";
import { AbcResult } from "../../..";
export interface IGeneralizedQuery<T> {
    (): Promise<T[]>;
}
/**
 * A generalized flow for queries; specific query helpers
 * should use this flow to standarize their approach.
 */
export declare function generalizedQuery<T>(queryDefn: IAbcQueryDefinition<T>, command: AbcRequestCommand, dexieQuery: IGeneralizedQuery<T>, firemodelQuery: IGeneralizedQuery<T>, ctx: AbcApi<T>, options: IAbcOptions<T>): Promise<AbcResult<T>>;
