import { MutationTree } from "vuex";
import { Model } from "firemodel";
export declare function reset<T extends Model>(propOffset?: keyof T & string): MutationTree<T>;
