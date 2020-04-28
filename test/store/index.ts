import Vuex, { Store } from "vuex";
import FiremodelPlugin, { IFiremodelState, abc, AsyncMockData } from "../../src/private";
import products, { IProductsState } from "./modules/products";
import userProfile, { IUserProfileState } from "./modules/userProfile";
import companies, { ICompaniesState } from "./modules/companies";
import { config } from "./config";
import { Product } from "../models/Product";
import { Company } from "../models/Company";
import { Person } from "../models/Person";
import Vue from "vue";
import { IDictionary } from "common-types";

Vue.use(Vuex);

export interface IRootState {
  products: IProductsState;
  userProfiles: IUserProfileState;
  companies: ICompaniesState;
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
      userProfile,
      companies
    },
    plugins: [FiremodelPlugin(config(data))]
  });
  return store;
};

export const getAbc = () => {
  const [getProducts, loadProducts] = abc(Product);
  const [getCompanies, loadCompanies] = abc(Company, {
    useIndexedDb: false
  });
  const [getUserProfile, loadUserProfile] = abc(Person, { isList: false });

  return {
    getProducts,
    loadProducts,
    getCompanies,
    loadCompanies,
    getUserProfile,
    loadUserProfile
  };
};
