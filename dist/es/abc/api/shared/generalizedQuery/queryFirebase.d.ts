import { AbcApi } from "../../..";
import { IGeneralizedFiremodelQuery, IQueryLocalResults, IQueryServerResults } from "../../../../types";
import { Model } from "firemodel";
/**
 * Queries Firebase with a query passed in `generalizedQuery` workflow function
 * which manages both local dexie queries along with firebase queries. This function
 * is to manage the Firebase aspects of the workflow.
 *
 * @param ctx the ABC API
 * @param firemodelQuery the query which will be run against Firebase
 * @param local results that came from the dexie query
 */
export declare function queryFirebase<T extends Model>(ctx: AbcApi<T>, firemodelQuery: IGeneralizedFiremodelQuery<T>, local: IQueryLocalResults<T, any>): Promise<IQueryServerResults<T, import("common-types").IDictionary<any>>>;
