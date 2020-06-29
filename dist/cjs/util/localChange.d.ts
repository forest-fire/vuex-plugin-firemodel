import { IFmWatchEvent } from "firemodel";
import { IFmLocalChange } from "../types";
/**
 * converts a "local change" event into the right data structure
 */
export declare function localChange(event: IFmWatchEvent): IFmLocalChange;
