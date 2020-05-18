import { getStore } from "../src/index"
import { expect } from "chai";
import { Product } from "./models/Product";
import { Store, MutationPayload } from "vuex";
import { IRootState } from "./store";
import { fakeIndexedDb } from "./helpers/fakeIndexedDb";
import { productData } from "./data/productData";
import { productDataExtra } from "./data/productDataExtra";
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
  where,
  AbcStrategy,
  List,
  IQueryServerResults,
  Model,
  IPrimaryKey,
  DbSyncOperation,
  FireModel,
  since,
  saveToIndexedDb,
} from "../src/private";

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
  
  beforeEach(async () => {
    await fakeIndexedDb();
    store = (await import("./store")).setupStore();
    const abc = (await import("./store")).getAbc();
    getProducts = abc.getProducts;
    loadProducts = abc.loadProducts;
    await AbcApi.connectIndexedDb();
    // TODO: find a better solution to get the mock database reset
    FireModel.defaultDb.mock.updateDB(productData, true);
    expect(
      AbcApi.getModelApi(Product).db.isConnected,
      "Product is connected in IndexedDB"
    );
    expect(AbcApi.indexedDbConnected).to.equal(true);
  });

  afterEach(async () => {
    store.state.products.all = [];
    await AbcApi.getModelApi(Product).dexieTable.clear();
    await AbcApi.clear();
    clearSubscription();
  });

  it("get.all() returns results from indexedDB into Vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const p = await List.all(Product);
    populateIndexedDB(tbl, p.data);

    const results = await getProducts(all());

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );
    expect(results.localRecords).to.have.lengthOf(
      numProducts,
      "local results should have all DB records"
    );

    expect(eventCounts["products/ABC_INDEXED_DB_SET_VUEX"]).to.equal(1);
  });

  it("get.all() when local has partial result", async () => {
    const store = getStore();
    const partialProducts = hashToArray(productData.products)
      .slice(0, 2)
      .map(i => ({ ...i, lastUpdated: i.lastUpdated - 1 }));
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(partialProducts);

    const numProducts = Object.keys(partialProducts).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(
      partialProducts.length,
      "IndexedDB has some products"
    );

    const q: IAbcQueryRequest<Product> = all();
    const results = await getProducts(q);

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.localRecords).to.have.lengthOf(
      partialProducts.length,
      "local records have correct count for what was in IndexedDb"
    );
    expect(results.serverRecords).to.be.undefined;
    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    const firstId = partialProducts[0].id;
    expect(
      store.state.products.all.find((i: Product) => i.id === firstId)
        ?.lastUpdated as number
    ).to.equal(
      results.records.find(i => i.id === firstId)?.lastUpdated as number,
      "Vuex should be updated with the records as well"
    );

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).to.equal(1);
  });

  it("get.all() when indexedDB has all records", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(hashToArray(productData.products));

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts,
      "IndexedDB has some products"
    );

    const q: IAbcQueryRequest<Product> = all();
    const results = await getProducts(q);

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.localRecords).to.have.lengthOf(
      numProducts,
      "local records have correct count for what was in IndexedDb"
    );
    expect(results.serverRecords).to.be.undefined;

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );
  });

  it("get.all() return results from firebase into indexedDB/Vuex", (done) => {
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    expect(Object.keys(db.mock.db.products)).to.have.lengthOf(numProducts, "DB should have all records");
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");

    getProducts(all(), { strategy: AbcStrategy.getFirebase }).then(async results => {
      expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");
      
      expect(results).to.instanceOf(
        AbcResult,
        "result is an instance of AbcResult"
      );

      store.subscribe(async (mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === `products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`) {
          expect(await tbl.toArray()).to.have.lengthOf(
            numProducts,
            "IndexedDB should have all DB records"
          );

          expect(state.products.all).to.have.lengthOf(
            numProducts,
            "Vuex should have all DB records"
          );
          done();
        }
      });
    });
  });

  it("get.where() when local state is empty", async () => {
    const store = getStore();
    const products = hashToArray(productData.products)
      .map(i => ({ ...i, lastUpdated: i.lastUpdated - 1 }));
    store.subscribe(subscription);

    const tbl = AbcApi.getModelApi(Product).dexieTable;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");
    await tbl.bulkPut(products);

    // Get server data and populate indexedDB
    const q: IAbcQueryRequest<Product> = where({
      property: "price",
      equals: 452
    });
    const results = await getProducts(q).catch(e => {
      console.log(e);
      throw e;
    });

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      2,
      "overall results should have the two records with a price of 452"
    );
    expect(results.localRecords).to.have.lengthOf(
      2,
      "local results should have the two records with a price of 452"
    );

    results.records.forEach(r => expect(r.price).to.equal(452));

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).to.equal(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.be.undefined;
  });

  it("get.where() when local has all records", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(hashToArray(productData.products));
    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts,
      "IndexedDB starts with full set of products"
    );

    const results = await getProducts(
      where({
        property: "price",
        equals: 452
      })
    );

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.localRecords).to.have.lengthOf(
      2,
      "Locally we should have the two records retrieved with the same WHERE clause (even though IndexedDB has more records it knows about)"
    );
    expect(results.serverRecords).to.be.undefined;
    expect(results.records).to.have.lengthOf(
      2,
      "overall records should have the two records retrieved from server"
    );

    results.records.forEach(r => expect(r.price).to.equal(452));

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).to.equal(1);
  });

  it("get.where() return results from firebase into indexedDB/Vuex", (done) => {
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    const numProductsFromQuery = Object.values(productData.products).filter((p: Product) => p.price === 452).length;
    expect(Object.keys(db.mock.db.products)).to.have.lengthOf(numProducts, "DB should have all records");
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");

    getProducts(where({
      property: "price",
      equals: 452
    }), { strategy: AbcStrategy.getFirebase }).then(async results => {
      expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");
      
      expect(results).to.instanceOf(
        AbcResult,
        "result is an instance of AbcResult"
      );

      store.subscribe(async (mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === `products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`) {
          expect(await tbl.toArray()).to.have.lengthOf(
            numProductsFromQuery,
            "IndexedDB should have all DB records"
          );
          
          expect(state.products.all).to.have.lengthOf(
            numProductsFromQuery,
            "Vuex have all DB records"
          );
          done();
        }
      });
    });
  });

  it.skip("get.where() when local has more records", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(
      hashToArray(productData.products).concat({
        id: "zzzz2",
        price: 452,
        name: "An old product",
        store: "1234",
        lastUpdated: 1,
        createdAt: 1
      })
    );
    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts + 1,
      "IndexedDB starts with an additional product"
    );

    const results = await getProducts(
      where({
        property: "price",
        equals: 452
      }),
      { strategy: AbcStrategy.getFirebase }
    );

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.localRecords).to.have.lengthOf(
      2,
      "Locally we should have the two records that the server PLUS the additional one"
    );
    expect(results.serverRecords).to.be.undefined;
    expect(results.records).to.have.lengthOf(
      2,
      "overall records should have the two records retrieved from server"
    );

    // expect(eventCounts[`products/ABC_LOCAL_QUERY_TO_VUEX`]).to.equal(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).to.equal(
      1,
      "Vuex update mutation was fired"
    );

    // ApiResult.records have only products priced at 452
    results.records.forEach(r => expect(r.price).to.equal(452));
    // Same with the Vuex state
    store.state.products.all.forEach((r: Product) =>
      expect(r.price).to.equal(452)
    );

    /* const pruneVuex = events.find(
      i => i[0] === "products/ABC_PRUNE_STALE_VUEX_RECORDS"
    );
    if (pruneVuex) {
      expect(pruneVuex[1].pks).to.be.an("array");
      expect(pruneVuex[1].pks).to.include("zzzz2");
    } */

    // Vuex should also ONLY have those records which came back from Server
    expect(store.state.products.all).to.have.lengthOf(2);

    const localMutation = events.find(
      i => i[0] === "products/ABC_LOCAL_QUERY_TO_VUEX"
    );
    if (localMutation) {
      expect(localMutation[1].localRecords).to.have.lengthOf(
        3,
        "all three records from IndexedDB come back"
      );
      expect(localMutation[1].serverRecords).to.have.lengthOf(0);
    } else {
      throw new Error("local mutation was incorrectly structured");
    }
  });

  it.skip("get.since(timestamp) when local state is empty", async () => {
    throw new Error("test not written");
  });

  it.skip("get.since(timestamp) when local state has all records", async () => {
    throw new Error("test not written");
  });

  it("load.all() returns results from firebase into indexedDB", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(all());

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      0,
      "no results should be in the vuex store"
    );
    expect(eventCounts["products/ABC_INDEXED_DB_SET_VUEX"]).to.be.undefined;
  });

  it("load.all() with loadVuex strategy returns results from indexedDB/firebase into vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(all(), { strategy: AbcStrategy.loadVuex });

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "all results from firebase should be in the vuex store"
    );
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.equal(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).to.equal(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]).to.be.undefined;
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]).to.be.undefined;
  });

  it("load.all() with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    // start with empty Vuex and IndexedDB state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(all(), { strategy: AbcStrategy.loadVuex });

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts, 
      "Cache should have all DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "overall results from DB should be in the vuex store"
    );
    // Update Firebase mock database
    const { totalProducts } = addNewProductsToMockDB(db.mock);

    // load more products into Vuex state
    await loadProducts(all(), { strategy: AbcStrategy.loadVuex });

    expect(store.state.products.all).to.have.lengthOf(
      totalProducts,
      "new products should be in the vuex store"
    );
    expect(await tbl.toArray()).to.have.lengthOf(
      totalProducts, 
      "IndexedDB should have all new records from Firebase DB records"
    );
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]).to.be.undefined;
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]).to.be.undefined;
  });

  it("load.where() returns results from firebase into indexedDB", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const selectedStore = Object.values(productData.products).filter(p => p.store === "1234");
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(where({
      property: "store",
      equals: "1234"
    }));

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );
    
    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts, 
      "IndexedDB should have all Firebase DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      0,
      "vuex store should be empty"
    );
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.undefined;
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]).to.be.undefined;
  });

  it("load.where() returns results from indexedDB/firebase into vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const selectedStore = Object.values(productData.products).filter(p => p.store === "1234");
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(where({
      property: "store",
      equals: "1234"
    }), { strategy: AbcStrategy.loadVuex });

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts, 
      "IndexedDB should have all Firebase DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "vuex store should be empty"
    );
    
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.equal(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).to.equal(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]).to.be.undefined;
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]).to.be.undefined;
  });

  it("load.where() with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const selectedStore = Object.values(productData.products).filter(p => p.store === "1234");
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(where({
      property: "store",
      equals: "1234"
    }), { strategy: AbcStrategy.loadVuex });

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts, 
      "IndexedDB should have all Firebase DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "vuex store should be empty"
    );

    // Update Firebase mock database
    const { products } = addNewProductsToMockDB(db.mock);
    const totalProducts = Object.values(products).filter(p => p.store === "1234").length;

    // TODO: check if the indexedDB results are correct, should they be wiped when new data is requested from firebase?
    // load more products into Vuex state
    await loadProducts(where(({
      property: "store",
      equals: "1234"
    })), { strategy: AbcStrategy.loadVuex });

    expect(store.state.products.all).to.have.lengthOf(
      totalProducts,
      "new products should be in the vuex store"
    );
    expect(await tbl.toArray()).to.have.lengthOf(
      totalProducts, 
      "IndexedDB should have all new records from Firebase DB records"
    );
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]).to.be.undefined;
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]).to.be.undefined;
  });

  it("load.since(timestamp) returns results from indexedDB", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const timestamp = new Date('December 10, 2019').getTime();
    const selectedStore = Object.values(productData.products).filter(p => p.lastUpdated > timestamp);
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(since({ timestamp }));

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts, 
      "IndexedDB should have all Firebase DB records"
    );
  });
  
  it("load.since(timestamp) returns results from indexedDB into/firebase vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const timestamp = new Date('December 10, 2019').getTime();
    const selectedStore = Object.values(productData.products).filter(p => p.lastUpdated > timestamp);
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(since({ timestamp }), { strategy: AbcStrategy.loadVuex });

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts, 
      "IndexedDB should have all Firebase DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "vuex store should be empty"
    );
  });

  it("load.since(timestamp) with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const timestamp = new Date('December 10, 2019').getTime();
    const selectedStore = Object.values(productData.products).filter(p => p.lastUpdated > timestamp);
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    // Get server data and populate indexedDB
    const results = await loadProducts(since({ timestamp }), { strategy: AbcStrategy.loadVuex });

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts, 
      "IndexedDB should have all Firebase DB records"
    );
    
    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "vuex store should be empty"
    );

    // Update Firebase mock database
    const { products } = addNewProductsToMockDB(db.mock);
    const totalProducts = Object.values(products).filter(p => (p.lastUpdated || new Date().getTime()) > timestamp).length;

    // TODO: check if the indexedDB results are correct, should they be wiped when new data is requested from firebase?
    // load more products into Vuex state
    await loadProducts(since({ timestamp }), { strategy: AbcStrategy.loadVuex });

    expect(store.state.products.all).to.have.lengthOf(
      totalProducts,
      "new products should be in the vuex store"
    );
    expect(await tbl.toArray()).to.have.lengthOf(
      totalProducts, 
      "IndexedDB should have all new records from Firebase DB records"
    );
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]).to.be.undefined;
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]).to.be.undefined;
  });

  it.skip("load.since() when local state is empty", async () => {
    throw new Error("test not written");
  });
});
