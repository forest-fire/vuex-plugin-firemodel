import { AbcApi, IQueryLocalResults, IQueryServerResults } from "../../../../private";
import { IGeneralizedQuery } from "..";
import { Model } from "firemodel";
export declare function queryFirebase<T extends Model>(ctx: AbcApi<T>, firemodelQuery: IGeneralizedQuery<T>, local: IQueryLocalResults<T, any>): Promise<IQueryServerResults<T, import("common-types").IDictionary<any>>>;
