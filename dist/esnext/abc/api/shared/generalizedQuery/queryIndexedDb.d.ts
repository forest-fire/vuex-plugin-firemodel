import { IGeneralizedQuery } from "..";
import { AbcApi } from "../..";
import { IQueryLocalResults } from "../../../..";
export declare function queryIndexedDb<T>(ctx: AbcApi<T>, dexieQuery: IGeneralizedQuery<T>, vuexPks: string[]): Promise<IQueryLocalResults<T, any>>;
