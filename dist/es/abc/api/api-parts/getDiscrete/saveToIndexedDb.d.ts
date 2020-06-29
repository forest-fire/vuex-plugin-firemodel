import { IDiscreteServerResults, IQueryServerResults } from "../../../../types";
import { IPrimaryKey, Model } from "firemodel";
import Dexie from "dexie";
export declare function saveToIndexedDb<T extends Model>(server: IQueryServerResults<T> | IDiscreteServerResults<T>, dexieTable: Dexie.Table<T, IPrimaryKey<T>>): Promise<any[]>;
