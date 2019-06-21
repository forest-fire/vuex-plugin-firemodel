import { IDictionary } from "common-types";
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
export declare const changeRoot: <T = IDictionary<any>>(state: T | null, newValues: T | null) => T | undefined;
