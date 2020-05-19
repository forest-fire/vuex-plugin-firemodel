import { Module, GetterTree } from "vuex";
import { IRootState } from "../index";
import { firemodelMutations } from "../../../src/private";
import { Company } from "../../models/Company";

export type ICompaniesState = {
  all: Company[];
};

export const state: ICompaniesState = {
  all: []
};

export const getters: GetterTree<ICompaniesState, IRootState> = {};

const companiesModule: Module<ICompaniesState, IRootState> = {
  state,
  mutations: firemodelMutations(),
  getters,
  namespaced: true
};

export default companiesModule;
