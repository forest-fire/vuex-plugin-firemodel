import { Model } from "firemodel";
import { AbcApi, IAbcApiConfig, IFmModelConstructor } from "../../private";
/**
 * Returns an array of **AbcApi** API's: `get`, `load`, and `watch`
 */
export declare function abc<T extends Model>(model: IFmModelConstructor<T>, config?: IAbcApiConfig<T>): [AbcApi<T>["get"], AbcApi<T>["load"], AbcApi<T>["watch"]];
