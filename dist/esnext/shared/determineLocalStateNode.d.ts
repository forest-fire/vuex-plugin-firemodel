import { IFmRecordEvent } from "firemodel";
/**
 * **pathToState**
 *
 * Takes a **Firemodel** server event and determines the
 * appropriate path to the local state node.
 */
export declare function determineLocalStateNode(payload: IFmRecordEvent, mutation: string): string;
