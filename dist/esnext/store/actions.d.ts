import { ActionTree } from "vuex";
import { IVuexState } from "../types";
export declare const actions: <T>() => ActionTree<IVuexState<T>, T>;
