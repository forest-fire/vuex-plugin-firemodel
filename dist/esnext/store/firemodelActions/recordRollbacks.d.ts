import { ActionTree } from "vuex";
import { IFiremodelState } from "../../index";
export declare const recordRollbacks: <T>() => ActionTree<IFiremodelState<T>, T>;
