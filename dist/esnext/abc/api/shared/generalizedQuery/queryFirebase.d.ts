import { IGeneralizedQuery } from "..";
import { AbcApi } from "../..";
import { Model } from "firemodel";
import { IQueryLocalResults, IQueryServerResults } from "../../../..";
export declare function queryFirebase<T extends Model>(ctx: AbcApi<T>, firemodelQuery: IGeneralizedQuery<T>, local: IQueryLocalResults<T, any>): Promise<IQueryServerResults<T, import("common-types").IDictionary<any>>>;
