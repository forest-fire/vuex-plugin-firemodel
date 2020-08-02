import { IDictionary } from "common-types";
import { arrayToHash } from "typed-conversions";

export function dynamicPathSet<T>(currentState: T, newState: T[]) {
  return {
    ...currentState,
    ...arrayToHash(newState)
  };
}
