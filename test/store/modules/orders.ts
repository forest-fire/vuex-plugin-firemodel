import { GetterTree, Module } from "vuex";

import { IRootState } from "../index";
import { Order } from "../../models/Order";
import { firemodelMutations } from "@/index";

export type IOrdersState = {
  all: Order[];
};

export const state: IOrdersState = {
  all: []
};

export const getters: GetterTree<IOrdersState, IRootState> = {};

const ordersModule: Module<IOrdersState, IRootState> = {
  state,
  mutations: firemodelMutations("all"),
  getters,
  namespaced: true
};

export default ordersModule;
