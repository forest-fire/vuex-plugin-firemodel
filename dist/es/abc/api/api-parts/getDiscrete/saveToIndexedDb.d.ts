import { Model, IPrimaryKey } from "firemodel";
import Dexie from "dexie";
import { IDiscreteServerResults, IQueryServerResults } from "../../../../private";
export declare function saveToIndexedDb<T extends Model>(server: IQueryServerResults<T> | IDiscreteServerResults<T>, dexieTable: Dexie.Table<T, IPrimaryKey<T>>): Promise<any[]>;
