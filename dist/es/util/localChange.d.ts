import { IFmWatchEvent } from "firemodel";
import { IFmLocalChange } from "../private";
/**
 * converts a "local change" event into the right data structure
 */
export declare function localChange(event: IFmWatchEvent): IFmLocalChange;
