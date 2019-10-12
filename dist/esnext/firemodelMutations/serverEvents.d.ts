import { MutationTree } from "vuex";
export declare function serverEvents<T>(propOffset?: keyof T & string): MutationTree<T>;
