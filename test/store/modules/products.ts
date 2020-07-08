import { GetterTree, Module } from "vuex";

import { IRootState } from "../index";
import { Product } from "../../models/Product";
import { firemodelMutations } from "@/index";

export type IProductsState = {
  all: Product[];
};

export const state: IProductsState = {
  all: []
};

export const getters: GetterTree<IProductsState, IRootState> = {};

const productsModule: Module<IProductsState, IRootState> = {
  state,
  mutations: firemodelMutations("all"),
  getters,
  namespaced: true
};

export default productsModule;
