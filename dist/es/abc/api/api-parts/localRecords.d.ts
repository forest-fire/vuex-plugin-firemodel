import { AbcRequestCommand, IDiscreteLocalResults, IDiscreteOptions } from "../../../types";
import { IPrimaryKey, Model } from "firemodel";
import { AbcApi } from "../AbcApi";
/**
 * For a discrete set of primary keys, get's all knowledge of these locally. This means
 * at least Vuex but also IndexedDB if the model is configured for it.
 *
 * It returns both
 * a complete list of the primary keys found, those still missing, as well as the records
 * themselves (where Vuex representation of a record trumps the IndexedDB representation)
 */
export declare function localRecords<T extends Model>(command: AbcRequestCommand, requestPks: IPrimaryKey<T>[], options: IDiscreteOptions<T>, context: AbcApi<T>): Promise<Omit<IDiscreteLocalResults<T>, "overallCachePerformance">>;
