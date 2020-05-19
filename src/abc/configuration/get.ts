import { AbcApi, IAbcApiConfig, IFmModelConstructor } from "../../private";
import { Model } from "firemodel";

/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
export function get<T extends Model>(model: IFmModelConstructor<T>, config: IAbcApiConfig<T> = {}) {  
  const api = new AbcApi(model, config);
  
  return api.get
}
