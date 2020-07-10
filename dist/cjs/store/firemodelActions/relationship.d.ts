import { IFiremodelState } from "../../types";
import { ActionTree } from "vuex";
export declare const relationship: <T>() => ActionTree<IFiremodelState<T>, T>;
