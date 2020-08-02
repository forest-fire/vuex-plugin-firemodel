import { IDictionary } from "common-types";
import { arrayToHash } from "typed-conversions";

export function merge<T>(currentState: T, newState: T[]) {
  return {
    ...currentState,
    ...arrayToHash(newState)
  };
}
