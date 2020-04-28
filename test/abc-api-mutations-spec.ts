import { setupStore } from "./store";
import { DbSyncOperation, IQueryResult, QueryType, AbcResult, AbcApi } from "../src/private";
import { expect } from "chai";
import { Product } from "./models/Product";

describe("mutations ->", () => {
  it(`set indexeddb data into vuex (${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX})`, async () => {
    const store = setupStore({});
    // store.subscribe((mutation) => {
    //   // console.log(mutation.type, Object.keys(firemodelMutations('all')));
    // });
    const data = (await import("./data/indexedDbProductData")).default;
    const queryResult: IQueryResult<any, any> = {
      type: "query",
      queryDefn: {
        queryType: QueryType.all,
      },
      local: {
        records: data,
        localPks: data.map(i => i.id),
        indexedDbPks: data.map(i => i.id),
        vuexPks: []
      },
      options: {}
    };

    const abcProduct = new AbcApi(Product);
    const result = await AbcResult.create(abcProduct, queryResult);

    const preCondition = store.state.products.all;
    expect(preCondition).to.have.lengthOf(0);

    store.commit(`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, result);
    const postCondition = store.state.products.all;
    expect(postCondition).to.have.lengthOf(data.length);
  });
})
