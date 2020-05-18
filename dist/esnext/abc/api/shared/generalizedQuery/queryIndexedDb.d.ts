import { IGeneralizedQuery } from "..";
import { IFmModelConstructor, IQueryLocalResults } from "../../../../private";
export declare function queryIndexedDb<T>(modelConstructor: IFmModelConstructor<T>, dexieQuery: IGeneralizedQuery<T>): Promise<IQueryLocalResults<T, any>>;
