import { IFmModelConstructor, IGeneralizedQuery, IQueryLocalResults } from "../../../../types";
export declare function queryIndexedDb<T>(modelConstructor: IFmModelConstructor<T>, dexieQuery: IGeneralizedQuery<T>): Promise<IQueryLocalResults<T, any>>;
