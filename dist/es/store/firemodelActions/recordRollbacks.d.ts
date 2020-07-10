import { IFiremodelState } from "../../types";
import { ActionTree } from "vuex";
export declare const recordRollbacks: <T>() => ActionTree<IFiremodelState<T>, T>;
