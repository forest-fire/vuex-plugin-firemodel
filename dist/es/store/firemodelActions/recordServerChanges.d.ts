import { IFiremodelState } from "../../types";
import { ActionTree } from "vuex";
export declare const recordServerChanges: <T>() => ActionTree<IFiremodelState<T>, T>;
