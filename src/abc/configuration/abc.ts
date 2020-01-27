import { AbcApi} from "../api/AbcApi";
import { IAbcApiConfig } from "../../types/abc";
import { IFmModelConstructor } from "../../types";
import { Model } from "firemodel";

/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
export function abc<T extends Model>(model: IFmModelConstructor<T>, config: IAbcApiConfig<T> = {}) {  
  const api = new AbcApi(model, config);
  return [ api.get.bind(api), api.load.bind(api), api.watch.bind(api) ]
}
