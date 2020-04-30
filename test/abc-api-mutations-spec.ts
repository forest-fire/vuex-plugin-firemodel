import { setupStore } from "./store";
import { DbSyncOperation, IQueryResult, QueryType, AbcResult, AbcApi, Model, abc, all } from "../src/private";
import { expect } from "chai";
import { ProductWithPath } from "./models/ProductWithPath";
import { Query } from "firemock";
import { generalizedQuery } from "../src/abc/api/shared";

async function createAbcResult<T extends Model>(abcApi, data: T[], queryType: string = QueryType.all) {
  const queryResult: IQueryResult<T, any> = {
    type: "query",
    queryDefn: {
      queryType,
    },
    local: {
      records: data,
      localPks: data.map(i => i.id),
      indexedDbPks: data.map(i => i.id),
      vuexPks: []
    },
    options: {
      offsets
    }
  };

  const result = await AbcResult.create(abcApi, queryResult);
  return result
}

describe("mutations ->", () => {
  let getProducts;
  let loadProducts;
  let abcProduct: AbcApi<ProductWithPath>;
  before(async () => {
    /** Get full AbcApi; to make meta available for testing purpose */
    abcProduct = new AbcApi(ProductWithPath);
    /** 
     * Instead of the more typical use case of get and load as illustrated below:
     * [getProducts, loadProducts] = abc(ProductWithPath);
     */
    [getProducts, loadProducts] = [abcProduct.get, abcProduct.load];
    await AbcApi.connectIndexedDb();
  });

  it(`indexeddb data updates vuex with a dynamically pathed model (${DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX})`, async () => {
    const data = (await import("./data/indexedDbProductData")).default;
    const tbl = AbcApi.getModelApi(ProductWithPath).dexieTable;
    await tbl.bulkPut(data);

    const products = generalizedQuery(all(), { offsets: { store: '1234' }});
  })

  it.skip(`set indexeddb data into vuex (${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX})`, async () => {
    const store = setupStore({});
    const data = (await import("./data/indexedDbProductData")).default;
    const result = await createAbcResult(abcProduct, data);

    const preCondition = store.state.products.all;
    expect(preCondition).to.have.lengthOf(0);

    store.commit(`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`, result);
    const postCondition = store.state.products.all;
    expect(postCondition).to.have.lengthOf(data.length);
  });

  it.skip(`set indexeddb data with dynamic path into vuex (${DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX})`, async () => {
    const data = (await import("./data/indexedDbProductData")).default;
    const store = setupStore({data});
    const newData = [
      {
        id: "pd-4543",
        name: "Hundred Water",
        price: 130,
        store: '1234',
        lastUpdated: 5533,
        createdAt: 3355
      },
      {
        id: "pd-1234",
        name: "Lemon Grass",
        price: 50,
        store: '1234',
        lastUpdated: 2455,
        createdAt: 2450
      },
    ]
    const result = await createAbcResult(abcProduct, newData, );

    const preCondition = store.state.products.all;
    expect(preCondition).to.have.lengthOf(6);

    store.commit(`products/${DbSyncOperation.ABC_INDEXED_DB_SET_DYNAMIC_PATH_VUEX}`, result);
    const postCondition = store.state.products.all;
    expect(postCondition).to.have.lengthOf(data.length + newData.length);
  });
})
