import Vuex, { Store } from "vuex";
import FiremodelPlugin, { IFiremodelState, abc } from "../../src/index";
import products, { IProductsState } from "./modules/products";
import userProfile, { IUserProfileState } from "./modules/userProfile";
import { config } from './config'
import { Product } from "../models/Product";
import { Company } from "../models/Company";
import { Person } from "../models/Person";
import Vue from "vue";
import { IDictionary } from "firemock";
import { AsyncMockData } from "firemock/dist/esnext/@types/config-types";

Vue.use(Vuex);

export interface IRootState {
  products: IProductsState;
  userProfiles: IUserProfileState;
  ["@firemodel"]: IFiremodelState<IRootState>;
}

export let store: Store<IRootState>;

/**
 * Store
 *
 * Sets up a Vuex store for testing purposes; note that DB data can be passed in
 * as a parameter
 */
export const setupStore = (data?: IDictionary | AsyncMockData) => {
  store = new Vuex.Store<IRootState>({
    modules: {
      products,
      userProfile
    },
    plugins: [
      FiremodelPlugin(config(data))
    ]
  });
  return store;
}

export const [getProducts, loadProducts] = abc(Product);
export const [getCompanies, loadCompanies] = abc(Company, { useIndexedDb: false });
export const [getUserProfile, loadUserProfile] = abc(Person, { isList: false });
