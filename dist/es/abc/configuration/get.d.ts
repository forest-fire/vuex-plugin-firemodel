import { IAbcApiConfig, IFmModelConstructor } from "../../private";
import { Model } from "firemodel";
/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
export declare function get<T extends Model>(model: IFmModelConstructor<T>, config?: IAbcApiConfig<T>): (request: import("../../private").IAbcParam<T>, options?: import("../../private").IAbcOptions<T>) => Promise<import("../api/AbcResult").AbcResult<T>>;
