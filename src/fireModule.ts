import { IRootState } from ".";
import { Module, MutationTree, ActionTree } from "vuex";
import { IFireModelState } from "./types";
import configActions from "./actions-config";
import configMutations from "./mutations-config";
import crudActions from "./actions-crud";

const state: IFireModelState = {
  authenticated: false,
  status: "unconfigured",
  queued: [],
  watching: [],
  localOnly: []
};

const mutations: MutationTree<IFireModelState> = {
  ...configMutations
};

const actions: ActionTree<IFireModelState, IRootState> = {
  ...configActions,
  ...crudActions
};

const firebaseModule: Module<IFireModelState, IRootState> = {
  state,
  mutations,
  actions,
  namespaced: true
};

export default firebaseModule;
