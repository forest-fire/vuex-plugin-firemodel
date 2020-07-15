import { IServerResults } from "../../../../types";
import { IPrimaryKey, Model } from "firemodel";
import Dexie from "dexie";
export declare function saveToIndexedDb<T extends Model>(server: IServerResults<T>, dexieTable: Dexie.Table<T, IPrimaryKey<T>>): Promise<any[]>;
