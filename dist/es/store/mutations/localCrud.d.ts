import { IFiremodelState } from "../../types";
import { MutationTree } from "vuex";
export declare const localCrud: <T>() => MutationTree<IFiremodelState<T>>;
