import { AbcApi } from "../../../../private";
export declare function getFromFirebase<T>(ctx: AbcApi<T>, requestIds: string[]): Promise<import("../../../../private").IDiscreteServerResults<T, import("common-types").IDictionary<any>>>;
