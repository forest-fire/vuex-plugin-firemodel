import { ActionTree } from "vuex";
import { IFiremodelState } from "../../private";
export declare const relationship: <T>() => ActionTree<IFiremodelState<T>, T>;
