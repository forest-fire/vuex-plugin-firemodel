import { IVuexState } from "../../private";
import { ActionTree } from "vuex";
export declare const firemodelActions: <T>() => ActionTree<IVuexState<T>, T>;
