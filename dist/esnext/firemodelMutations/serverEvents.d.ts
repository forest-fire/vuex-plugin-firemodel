import { MutationTree } from "vuex";
import { IDictionary } from "firemock";
export declare function serverEvents<T = MutationTree<IDictionary>>(propOffset?: string): MutationTree<T>;
