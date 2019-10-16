import { MutationTree } from "vuex";
export declare function watchEvents<T>(propOffset?: keyof T & string): MutationTree<T>;
