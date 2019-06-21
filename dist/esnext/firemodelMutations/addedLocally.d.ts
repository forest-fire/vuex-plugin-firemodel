import { MutationTree } from "vuex";
import { Model } from "firemodel";
import { IFiremodelState } from "../types";
export declare function addedLocally<T extends Model>(propOffset?: string): MutationTree<IFiremodelState>;
