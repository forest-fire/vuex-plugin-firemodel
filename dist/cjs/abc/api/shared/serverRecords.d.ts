import { AbcApi } from "../AbcApi";
import { Model, pk } from "firemodel";
import { IDiscreteServerResults } from "../../../types";
export declare function serverRecords<T extends Model>(context: AbcApi<T>, pks: pk[], allPks: pk[]): Promise<IDiscreteServerResults<T>>;
