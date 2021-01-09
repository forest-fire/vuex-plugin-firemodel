import type { IAbcApiConfig, IFmModelConstructor } from "@/types"

import { AbcApi } from "@/abc/api";
import { Model } from "firemodel";

/**
 * Returns an array of **AbcApi** API's: `get`, `load`, and `watch`
 */
export function abc<T extends Model>(
  model: IFmModelConstructor<T>,
  config: IAbcApiConfig<T> = {}
): [AbcApi<T>["get"], AbcApi<T>["load"], AbcApi<T>["watch"]] {
  const api = new AbcApi(model, config);

  return [api.get.bind(api), api.load.bind(api), api.watch.bind(api)];
}
