import { IPrimaryKey } from "firemodel";
import { AbcApi } from "../..";
import { IDiscreteLocalResults } from "../../../..";
export declare function mergeLocalRecords<T>(context: AbcApi<T>, idxRecords: T[], vuexRecords: T[], requestPks: IPrimaryKey<T>[]): IDiscreteLocalResults<T, import("common-types").IDictionary<any>> | undefined;
