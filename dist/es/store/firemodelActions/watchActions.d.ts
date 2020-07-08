import { IFiremodelState } from "../../types";
import { ActionTree } from "vuex";
export declare const watchActions: <T>() => ActionTree<IFiremodelState<T>, T>;
