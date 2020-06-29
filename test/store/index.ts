import { AsyncMockData, IVuexState, abc } from "../../src/private";
import Vue from "vue";
import Vuex, { Store } from "vuex";
import companies, { ICompaniesState } from "./modules/companies";
import products, { IProductsState } from "./modules/products";
import userProfile, { IUserProfileState } from "./modules/userProfile";
import orders, { IOrdersState } from "./modules/orders";

import { Company } from "../models/Company";
import { FiremodelPlugin } from "../../src/private"
import { IDictionary } from "common-types";
import { Person } from "../models/Person";
import { Product } from "../models/Product";
import { RealTimeClient } from "@forest-fire/real-time-client";
import { Order } from "../models/Order";
import { config } from "./config";
import * as lifecycle from "./lifecycle";

Vue.use(Vuex);

export interface IRootState {
  products: IProductsState;
  userProfiles: IUserProfileState;
  companies: ICompaniesState;
  orders: IOrdersState;
  ["@firemodel"]: IVuexState<IRootState>;
}

export let store: Store<IRootState>;

/**
 * Store
 *
 * Sets up a Vuex store for testing purposes; note that DB data can be passed in
 * as a parameter
 */
export const setupStore = (data?: IDictionary | AsyncMockData) => {
  const db = new RealTimeClient(config(data))
  store = new Vuex.Store<IRootState>({
    modules: {
      products,
      userProfile,
      companies,
      orders,
    },
    plugins: [FiremodelPlugin(db, {
      connect: true,
      auth: true,
      ...lifecycle
    })]
  });
  return store;
};

export const getAbc = () => {
  const [getOrders, loadOrders] = abc(Order, { useIndexedDb: true });
  const [getProducts, loadProducts] = abc(Product, { useIndexedDb: true });
  const [getCompanies, loadCompanies] = abc(Company, {
    useIndexedDb: false
  });
  const [getUserProfile, loadUserProfile] = abc(Person, { isList: false });

  return {
    getProducts,
    loadProducts,
    getOrders,
    loadOrders,
    getCompanies,
    loadCompanies,
    getUserProfile,
    loadUserProfile
  };
};
