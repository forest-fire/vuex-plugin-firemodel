import { IDiscreteLocalResults, IDiscreteOptions } from "../../../..";
import { AbcApi, AbcResult } from "../..";
export declare function getFromFirebase<T>(ctx: AbcApi<T>, local: IDiscreteLocalResults<T> | undefined, options: IDiscreteOptions<T> | undefined, requestIds: string[]): Promise<{
    server: import("../../../..").IDiscreteServerResults<T, import("common-types").IDictionary<any>>;
    serverResults: AbcResult<T>;
}>;
