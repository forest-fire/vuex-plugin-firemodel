import { AbcResult, AbcApi } from "..";
import { AbcRequestCommand, IDiscreteLocalResults, IDiscreteOptions } from "../../../types/abc";
import { IDiscreteServerResults, Model } from "../../..";
export declare function requestIndexedDb<T>(command: AbcRequestCommand, ctx: AbcApi<T>, options: IDiscreteOptions<T> | undefined, requestIds: string[]): Promise<{
    local: IDiscreteLocalResults<T, import("common-types").IDictionary<any>>;
    localResult: AbcResult<T>;
} | {
    local: IDiscreteLocalResults<T, import("common-types").IDictionary<any>> | undefined;
    localResult?: undefined;
}>;
export declare function requestServer<T>(command: AbcRequestCommand, ctx: AbcApi<T>, local: IDiscreteLocalResults<T> | undefined, options: IDiscreteOptions<T> | undefined, requestIds: string[]): Promise<{
    server: IDiscreteServerResults<T, import("common-types").IDictionary<any>>;
    serverResults: AbcResult<T>;
}>;
export declare function cacheIndexedDB<T>(server: IDiscreteServerResults<Model>, serverResults: AbcResult<T>): Promise<void>;
