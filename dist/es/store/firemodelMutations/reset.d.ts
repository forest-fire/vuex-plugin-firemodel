import { Model } from "firemodel";
import { MutationTree } from "vuex";
export declare function reset<T extends Model>(propOffset?: keyof T & string): MutationTree<T>;
