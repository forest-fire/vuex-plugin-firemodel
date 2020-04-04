import { IDiscreteServerResults } from "../../../..";
import { Model, IPrimaryKey } from "firemodel";
import Dexie from "dexie";
export declare function saveToIndexedDb<T extends Model>(server: IDiscreteServerResults<T>, dexieTable: Dexie.Table<T, IPrimaryKey<T>>): Promise<any[]>;
