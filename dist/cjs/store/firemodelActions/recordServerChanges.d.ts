import { ActionTree } from "vuex";
import { IFiremodelState } from "../../index";
export declare const recordServerChanges: <T>() => ActionTree<IFiremodelState<T>, T>;
