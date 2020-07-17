import { IPrimaryKey, Model } from "firemodel";
import Dexie from "dexie";
import { AbcResult } from "../../AbcResult";
export declare function saveToIndexedDb<T extends Model>(server: AbcResult<T>, dexieTable: Dexie.Table<T, IPrimaryKey<T>>): Promise<any[]>;
