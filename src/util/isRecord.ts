import { IDictionary } from "common-types";
import { IFmWatchEvent, IModel } from "firemodel";

/**
 * Detects whether the change is a `Record` or a `List` and ensures
 * that the **state** parameter is typed correctly as well as passing
 * back a boolean flag at runtime.
 */
export function isRecord<T extends IModel>(
  state: T | IDictionary<T[]>,
  payload: IFmWatchEvent<T>
): state is T {
  return payload.watcherSource === "record";
}
