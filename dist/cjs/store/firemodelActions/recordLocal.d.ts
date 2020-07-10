import { IFiremodelState } from "../../types";
import { ActionTree } from "vuex";
export declare const recordLocal: <T>() => ActionTree<IFiremodelState<T>, T>;
