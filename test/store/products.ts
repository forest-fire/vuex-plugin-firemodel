import { Module, GetterTree } from "vuex";
import { IRootState } from "./index";
import { firemodelMutations } from "../../src";
import { Product } from "../models/Product"

export type IProductsState = {
  all: Product[]
};

export const state: IProductsState = {
  all: []
};

export const getters: GetterTree<IProductsState, IRootState> = {
};

const productsModule: Module<IProductsState, IRootState> = {
  state,
  mutations: firemodelMutations('all'),
  getters,
  namespaced: true
};

export default productsModule;