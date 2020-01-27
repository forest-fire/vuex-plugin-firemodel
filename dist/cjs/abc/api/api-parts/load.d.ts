import { Model } from "firemodel";
export declare function loadQuery<T extends Model>(query: any, options: any): Promise<T[]>;
export declare function loadIds<T extends Model>(...args: any[]): Promise<T[]>;
