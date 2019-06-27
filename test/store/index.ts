import Vuex from "vuex";
import FirePlugin, { IFiremodelState, IFiremodelConfig } from "../../src/index";

export interface IRootState {
  products: IProductsState;
  userProfiles: IUserProfileState;
  ["@firemodel"]: IFiremodelState;
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
      userProfiles
    },
    plugins: [
      FirePlugin({
        db: { mocking: true },
        connect: true,
        watchAuth: true,
        anonymousAuth: true,

        ...fns
      } as IFiremodelConfig) // TODO needs proper fixing
    ]
  });
