import { IFmContextualizedWatchEvent } from "firemodel";
import { IFmLocalChange } from "../index";
/**
 * converts a "local change" event into the right data structure
 */
export declare function localChange(event: IFmContextualizedWatchEvent): IFmLocalChange;
