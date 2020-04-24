import { IDiscreteServerResults, IQueryServerResults } from "../../../..";
import { Model, IPrimaryKey } from "firemodel";
import Dexie from "dexie";
export declare function saveToIndexedDb<T extends Model>(server: IQueryServerResults<T> | IDiscreteServerResults<T>, dexieTable: Dexie.Table<T, IPrimaryKey<T>>): Promise<any[]>;
