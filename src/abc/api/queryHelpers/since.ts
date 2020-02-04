import { AbcApi } from "../AbcApi";
import { IDictionary } from "common-types";
import { Model } from "firemodel";
import {
  AbcRequestCommand,
  IAbcSinceQueryDefinition,
  IAbcAllQueryDefinition
} from "../../../types";

/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since<T extends Model = IDictionary>(
  defn: Omit<IAbcSinceQueryDefinition<T>, "queryType">
) {
  return function all<T>(defn?: Omit<IAbcAllQueryDefinition<T>, "queryType">) {
    return async (command: AbcRequestCommand, ctx: AbcApi<T>) => {};
  };
};

since.prototype.isQueryHelper = true;

export { since };
