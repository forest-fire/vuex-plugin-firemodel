import { Model, pk } from "firemodel";
import { IDiscreteServerResults, AbcApi } from "../../../private";
export declare function serverRecords<T extends Model>(context: AbcApi<T>, pks: pk[], allPks: pk[]): Promise<IDiscreteServerResults<T>>;
