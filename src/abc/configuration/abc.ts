import { AbcApi } from "../api/AbcApi";
import { IAbcApiConfig } from "../../types/abc";
import { IFmModelConstructor } from "../../types";
import { Model } from "firemodel";
import { database } from "../../shared/database";

/**
 * Returns an array of **AbcApi** API's: `get`, `load`, and `watch`
 */
export function abc<T extends Model>(model: IFmModelConstructor<T>, config: IAbcApiConfig<T> = {}) {
  const api = new AbcApi(model, config);
  console.log('abc: ', AbcApi.configuredModels);

  return [
    api.get.bind(api) as AbcApi<T>['get'],
    api.load.bind(api) as AbcApi<T>['load'],
    api.watch.bind(api) as AbcApi<T>['watch']
  ]
}
