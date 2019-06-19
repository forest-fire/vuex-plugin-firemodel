import { IDictionary } from "common-types";
import { Model } from "firemodel";

/**
 * **changeRoot**
 *
 * Allows a mutation to reset the root object of a module's
 * state tree while avoiding the classic object "de-referencing"
 * which can result in the state tree not being updated.
 *
 * @param state
 * @param newValues
 */
export const changeRoot = <T = IDictionary>(
  state: T | null,
  newValues: T | null
) => {
  if (newValues === null) {
    state = null;
    return;
  }

  // ensure state is set to T
  state = (state !== null ? state : {}) as T;

  /**
   * rather than replace the root object reference,
   * iterate through each property and change that
   */
  Object.keys(newValues).forEach((v: keyof T & string) => {
    (state as T)[v] = newValues[v];
  });

  /**
   * If the `newValues` passed in omitted properties but the state
   * tree has values for it we must remove those properties as this
   * is a "destructive" update.
   */
  const removed: string[] = Object.keys(state).filter(
    k => k && !Object.keys(newValues).includes(k)
  );

  Object.keys(removed).forEach(k => {
    delete (state as T)[k as keyof typeof state];
  });
  return state;
};
