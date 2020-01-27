import Vuex from "vuex";
import FiremodelPlugin, { IFiremodelState } from "../../src/index";
import products, { IProductsState } from "./modules/products";
import userProfile, { IUserProfileState } from "./modules/userProfile";
import { config } from './config'

export interface IRootState {
  products: IProductsState;
  userProfiles: IUserProfileState;
  ["@firemodel"]: IFiremodelState<IRootState>;
}

/**
 * Store
 *
 * Sets up a Vuex store for testing purposes where you can pass in 0 or more
 * handler functions.
 */
export const store = (fns: Array<Function>) =>
  new Vuex.Store<IRootState>({
    modules: {
      products,
      userProfile
    },
    plugins: [
      FiremodelPlugin(config)
    ]
  });
