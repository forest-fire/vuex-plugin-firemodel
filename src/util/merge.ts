import { arrayToHash, hashToArray } from "typed-conversions";

export function merge<T>(currentState: T[], newState: T[]) {
  return hashToArray({
    ...arrayToHash(currentState),
    ...arrayToHash(newState)
  });
}
