import { Module, GetterTree } from "vuex";
import { IRootState } from "./index";
import { firemodelMutations } from "../../src";

export type ProductSortType = "popular" | "recent" | "brand" | "name" | "price";

export interface IProductState {
  name: string;
  description: string;
}

export interface IProductsState {
  /** the current shopping bag for the user */
  all: IProductState[];
  territory: string;
}

export const state: IProductsState = {
  all: [],
  territory: "12345"
};

function compareString(a: string, b: string) {
  a = a.toLocaleLowerCase();
  b = b.toLocaleLowerCase();
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
}

function compareNumbersWithUndefined(
  a: number | undefined,
  b: number | undefined
) {
  if (a === undefined) return 1;
  else if (b === undefined) return -1;
  else if (a === b) return 0;
  else return a - b;
}

function filterAndSortCategory(state: IProductsState, categoryId: string) {
  return (
    state.all
      .filter((product: Product) => {
        return product.categoryId === categoryId;
      })
      // .filter - we don't have subcategories yet, but in the future
      // there will be one more filter function to filter subcategories
      .sort((a: Product, b: Product) => {
        switch (state.sortType) {
          // we need more compare functions
          // case 'popular':
          //   return compare...
          // case 'brand':
          //   return compare...
          case "name":
            return compareString(a.name, b.name);
          case "recent":
            return compareNumbersWithUndefined(a.createdAt, b.createdAt);
          /** default is 'price' */
          default:
            return parseInt(a.price) - parseInt(b.price);
        }
      })
  );
}

export const getters: GetterTree<IProductsState, IRootState> = {
  // TODO: Ed, let's discuss if this is the best way to do this (ken)
  byId: store => (id: string) => store.all.find(product => product.id === id),
  getSortType(store) {
    return store.sortType;
  },

  byCategory(state, getters, rootState) {
    let categories = {};
    rootState.productCategories.all.map((category: ProductCategory) => {
      if (category && category.id) {
        categories = Object.assign(categories, {
          [category.id]: filterAndSortCategory(state, category.id)
        });
      }
    });
    return categories;
  },
  discounted() {
    return [];
  }
};

const mutations: MutationTree<IProductsState> = {
  ...firemodelMutations<IProductsState>("all"),
  setProductsSortType(state, payload) {
    state.sortType = payload;
  }
};

const vuexModule: Module<IProductsState, IRootState> = {
  state,
  mutations,
  getters,
  namespaced: true
};

export default vuexModule;
