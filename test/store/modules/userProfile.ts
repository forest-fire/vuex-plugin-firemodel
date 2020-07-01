import { GetterTree, Module } from "vuex";

import { IRootState } from "../index";
import { firemodelMutations } from "@/index";

export type IUserProfileState = {
  name: {
    first: string;
    last: string;
  };
  restrictedByAge: boolean;
  uid: string;
  deliveryAddresses: {
    [name: string]: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      zipcode: string;
    };
  };
};

export const state: IUserProfileState = {
  name: {
    first: "",
    last: ""
  },
  restrictedByAge: process.env.NODE_ENV === "production",
  uid: "",
  deliveryAddresses: {}
};

export const getters: GetterTree<IUserProfileState, IRootState> = {
  isRestrictedByAge() {
    return state.restrictedByAge;
  }
};

const userProfileModule: Module<IUserProfileState, IRootState> = {
  state,
  mutations: firemodelMutations(),
  getters,
  namespaced: true
};

export default userProfileModule;
