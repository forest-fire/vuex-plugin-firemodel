import { DexieRecord, IPrimaryKey, Model } from "firemodel";
export declare function getFromIndexedDb<T extends Model>(dexieRecord: DexieRecord<T>, requestPks: IPrimaryKey<T>[]): Promise<T[]>;
