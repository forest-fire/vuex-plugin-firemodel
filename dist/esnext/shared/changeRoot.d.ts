import { Model } from "firemodel";
/**
 * **changeRoot**
 *
 * Allows a mutation to reset the root object of a module's
 * state tree while avoiding the classic object "de-referencing"
 * which can result in the state tree not being updated.
 *
 * @param state
 * @param updatedProps
 */
export declare const changeRoot: <T extends Model = Model>(state: T, updatedProps: T | null) => T | undefined;
