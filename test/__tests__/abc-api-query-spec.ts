import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { Store, MutationPayload } from "vuex";
import { IRootState } from "../store";
import { fakeIndexedDb } from "../helpers/fakeIndexedDb";
import { orderData } from "../data/orderData";
import { productData } from "../data/productData";
import { productDataExtra } from "../data/productDataExtra";
import { IDictionary } from "common-types";
import { hashToArray } from "typed-conversions";
import Dexie from "dexie";
import { Mock } from "firemock"
import {
  all,
  AbcApi,
  IAbcRequest,
  IAbcQueryRequest,
  AbcResult,
  getStore,
  where,
  AbcStrategy,
  IQueryServerResults,
  DbSyncOperation,
  since,
  saveToIndexedDb,
} from "../../src/private";
import { Model, IPrimaryKey, FireModel, List } from "firemodel";

let events: Array<[string, any]> = [];
let eventCounts: IDictionary<number> = {};

function subscription(mutation: MutationPayload, state: IDictionary): void {
  if (!eventCounts[mutation.type]) {
    eventCounts[mutation.type] = 1;
  } else {
    eventCounts[mutation.type] = eventCounts[mutation.type] + 1;
  }

  events.push([mutation.type, mutation.payload]);
}

/**
 * Resets counters for Mutation tracking
 */
function clearSubscription() {
  events = [];
  eventCounts = {};
}

async function populateIndexedDB<T extends Model>(
  tbl: Dexie.Table<T, IPrimaryKey<T>>,
  serverRecords: any
) {
  const server: IQueryServerResults<T> = {
    records: serverRecords,
    serverPks: [],
    newPks: [],
    cacheHits: [],
    stalePks: [],
    removeFromIdx: [],
    removeFromVuex: [],
    overallCachePerformance: {
      hits: 0,
      misses: 0,
      ignores: 0,
    }
  };
  await saveToIndexedDb(server, tbl);
}

interface ProductData {
  products: Product[]
  totalProducts: number
}

function addNewProductsToMockDB(mock: Mock): ProductData {
  const mockDbProducts = mock.db.products;
  const productsNew = productDataExtra.products;
  const products: Product[] = {
    ...mockDbProducts,
    ...productsNew
  };

  mock.updateDB({ products }, true);

  return {
    products: mock.db.products,
    totalProducts: Object.keys(mock.db.products).length
  };
}

describe("ABC API Query - with a model with IndexedDB support => ", () => {
  let store: Store<IRootState>;
  let getProducts: IAbcRequest<Product>;
  let loadProducts: IAbcRequest<Product>;
  let getOrders: IAbcRequest<Order>;
  let loadOrders: IAbcRequest<Order>;

  beforeEach(async () => {
    await fakeIndexedDb();
    store = (await import("../store")).setupStore();
    const abc = (await import("../store")).getAbc();
    getProducts = abc.getProducts;
    loadProducts = abc.loadProducts;
    getOrders = abc.getOrders;
    loadOrders = abc.loadOrders;
    await AbcApi.connectIndexedDb();
    // TODO: find a better solution to get the mock database reset
    FireModel.defaultDb.mock.updateDB({ ...productData, ...orderData }, true);
    expect(AbcApi.getModelApi(Product).db.isConnected);
    expect(AbcApi.getModelApi(Order).db.isConnected);
    expect(AbcApi.indexedDbConnected).toEqual(true);
  });

  afterEach(async () => {
    store.state.products.all = [];
    await AbcApi.getModelApi(Product).dexieTable.clear();
    await AbcApi.clear();
    clearSubscription();
  });

  it.only("get.all() returns results from indexedDB into Vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const p = await List.all(Product);
    populateIndexedDB(tbl, p.data);

    const results = await getProducts(all());

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);
    expect(results.localRecords).toHaveLength(numProducts);

    expect(eventCounts["products/ABC_INDEXED_DB_SET_VUEX"]).toEqual(1);
  });

  xit("get.all() when local has partial result", async () => {
    const store = getStore();
    const partialProducts = hashToArray(productData.products)
      .slice(0, 2)
      .map(i => ({ ...i, lastUpdated: i.lastUpdated - 1 }));
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(partialProducts);

    const numProducts = Object.keys(partialProducts).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(partialProducts.length);

    const q: IAbcQueryRequest<Product> = all();
    const results = await getProducts(q);

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.localRecords).toHaveLength(partialProducts.length);
    expect(results.serverRecords).toBeUndefined();
    expect(results.records).toHaveLength(numProducts);

    const firstId = partialProducts[0].id;
    expect(
      store.state.products.all.find((i: Product) => i.id === firstId)
        ?.lastUpdated as number
    ).toEqual(
      results.records.find(i => i.id === firstId)?.lastUpdated as number
    );

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).toEqual(1);
  });

  xit("get.all() when indexedDB has all records", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(hashToArray(productData.products));

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(numProducts);

    const q: IAbcQueryRequest<Product> = all();
    const results = await getProducts(q);

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.localRecords).toHaveLength(numProducts);
    expect(results.serverRecords).toBeUndefined();

    expect(results.records).toHaveLength(numProducts);
  });

  xit("load.all() returns results from firebase into indexedDB", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(all());

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(0);
    expect(eventCounts["products/ABC_INDEXED_DB_SET_VUEX"]).toBeUndefined();
  });
});
