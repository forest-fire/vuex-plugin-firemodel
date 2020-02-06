import { AbcApi } from "../AbcApi";
import { Model, pk } from "firemodel";
import { AbcRequestCommand, IDiscreteServerResults } from "../../../types";
export declare function serverRecords<T extends Model>(apiCommand: AbcRequestCommand, context: AbcApi<T>, pks: pk[], allPks: pk[]): Promise<IDiscreteServerResults<T>>;
