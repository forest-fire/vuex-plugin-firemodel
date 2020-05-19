import { IPrimaryKey, DexieRecord, Model } from "../../../../private";
export declare function getFromIndexedDb<T extends Model>(dexieRecord: DexieRecord<T>, requestPks: IPrimaryKey<T>[]): Promise<T[]>;
