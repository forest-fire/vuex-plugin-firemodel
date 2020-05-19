import { Model } from "firemodel";
import { IGeneralizedQuery, AbcApi, IQueryLocalResults, IQueryServerResults } from "../../../../private";
export declare function queryFirebase<T extends Model>(ctx: AbcApi<T>, firemodelQuery: IGeneralizedQuery<T>, local: IQueryLocalResults<T, any>): Promise<IQueryServerResults<T, import("common-types").IDictionary<any>>>;
