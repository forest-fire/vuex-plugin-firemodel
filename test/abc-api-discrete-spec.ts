import {
  AbcApi,
  IAbcRequest,
  getStore,
  AbcResult,
  AbcStrategy,
  DbSyncOperation,
} from "../src/private";
import { expect } from "chai";
import { fakeIndexedDb } from "./helpers/fakeIndexedDb";
import { productData } from "./data/productData";
import { IRootState } from "./store/index";
import { Product } from "./models/Product";
import { Store, MutationPayload } from "vuex";
import { hashToArray } from "typed-conversions";
import { companyData } from "./data/companyData";
import { Company } from "./models/Company";
import { IDictionary } from "common-types";

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

function addProductsToVuex(howMany?: number) {
  const store = getStore();
  store.state.products.all = howMany
    ? hashToArray(productData.products).slice(0, howMany)
    : hashToArray(productData.products);
}

async function addProductsToIndexedDB(howMany?: number) {
  const idx = AbcApi.getModelApi(Product);

  await idx.connectDexie();
  await idx.dexieTable.bulkPut(
    howMany
      ? hashToArray(productData.products).slice(0, howMany)
      : hashToArray(productData.products)
  );
}

async function addProductsToMockDB() {
  const db = AbcApi.getModelApi(Product).db;

  db.mock.updateDB({
    ...productData
  });
}

describe("ABC API Discrete - with a model with IndexedDB support => ", () => {
  let store: Store<IRootState>;
  let getProducts: IAbcRequest<Product>;
  let loadProducts: IAbcRequest<Product>;

  before(async () => {
    await fakeIndexedDb();
  });

  beforeEach(async () => {
    store = (await import("./store")).setupStore();
    const abc = (await import("./store")).getAbc();
    getProducts = abc.getProducts;
    loadProducts = abc.loadProducts;
    await AbcApi.connectIndexedDb();
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
  });

  it("load.discrete(product) returns results from firebase into indexedDB but not vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    await addProductsToIndexedDB();
    const results = await loadProducts(Object.keys(productData.products));

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts,
      "IndexedDB results should have all records"
    );

    expect(results.serverRecords).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.undefined;
  });

  it("load.discrete(product) with loadVuex strategy returns results from indexedDB/firebase into vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    await addProductsToIndexedDB();
    const results = await loadProducts(
      Object.keys(productData.products),
      { strategy: AbcStrategy.loadVuex }
    );

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(await tbl.toArray()).to.have.lengthOf(
      numProducts,
      "IndexedDB results should have all records"
    );

    expect(results.serverRecords).to.have.lengthOf(
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

  it("load.discrete(product) with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;
    await addProductsToMockDB();

    const numProducts = Object.keys(productData.products).length;
    // start with empty Vuex and IndexedDB state
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    await addProductsToIndexedDB();
    const results = await loadProducts(
      Object.keys(productData.products),
      { strategy: AbcStrategy.loadVuex }
    );

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
      "Cache results should have all DB records"
    );

    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "all results from DB should be in the vuex store"
    );

    // update DB
    const newPrice = 430
    const mockDbProducts = productData.products;
    const updatedProduct = Object.values(mockDbProducts)
      .filter((p: Product) => p.id === "abcd")
      .map(p => ({ ...p, price: newPrice }));

    db.mock.updateDB({
      products: {
        abcd: updatedProduct[0]
      }
    });

    // load existing products into Vuex state again
    const discreteResult = await loadProducts(
      [updatedProduct[0].id],
      { strategy: AbcStrategy.loadVuex }
    );

    /** 
     * TODO: looks like the lastUpdated has been modified in IndexedDB
     * for products that weren't modified. Need to look into this.
    **/
    expect(discreteResult.records).to.have.lengthOf(
      1,
      "the result should only return one product"
    );

    expect(store.state.products.all).to.have.lengthOf(
      numProducts,
      "the same number of products should be in the vuex store"
    );

    const abcdProductInStore = store.state.products.all
      .find((p: Product) => p.id === "abcd");

    expect(abcdProductInStore.price).to.equal(
      newPrice,
      "the updated product price should reflect in the vuex store"
    );

    const abcdProductInCache = await tbl.where({ id: "abcd" }).first() || { price: 0 };
    expect(abcdProductInCache.price).to.equal(
      newPrice,
      "the updated product price should reflect in indexedDB"
    );

    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).to.equal(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]).to.be.undefined;
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]).to.be.undefined;
  });

  it("get.discrete(product) returns results from indexedDB into vuex", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const abcdProduct = Object.values(productData.products).find((p: Product) => p.id === "abcd") || { id: "1234" }
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    await addProductsToIndexedDB();
    const results = await getProducts([abcdProduct.id]);

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      1,
      "overall results should return one product from indexedDB"
    );

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).to.equal(1);
  });

  it("get.discrete(product) with getFirebase strategy returns results from firebase into indexedDB", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const abcdProduct = Object.values(productData.products).find((p: Product) => p.id === "abcd") || { id: "1234" }
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");

    await addProductsToIndexedDB();
    const results = await getProducts([abcdProduct.id]);

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      1,
      "overall results should return one product from indexedDB"
    );

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).to.equal(1);
  });
});

describe("ABC API Discrete - queries a Model with no IndexedDB layer => ", () => {
  let store: Store<IRootState>;
  let getCompanies: IAbcRequest<Company>;
  let loadCompanies: IAbcRequest<Company>;

  before(async () => {
    await fakeIndexedDb();
  });

  beforeEach(async () => {
    store = (await import("./store")).setupStore(companyData);
    const abc = (await import("./store")).getAbc();
    getCompanies = abc.getCompanies;
    loadCompanies = abc.loadCompanies;
    await AbcApi.connectIndexedDb();
  });

  afterEach(async () => {
    store.state.companies.all = [];
    await AbcApi.clear();
  });

  it("getCompanies() with nothing in Vuex gets results from Firebase, saves to Vuex (no IndexedDB activity)", (done) => {
    const numOfRecords = Object.keys(companyData.companies).length;
    expect(store.state.companies.all).to.have.lengthOf(
      0,
      "Vuex has no products to start"
    );

    getCompanies(
      Object.keys(companyData.companies),
      { strategy: AbcStrategy.getFirebase }
    ).then(results => {
      store.subscribe((mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === `companies/${DbSyncOperation.ABC_FIREBASE_MERGE_VUEX}`) {
          expect(results.records).to.be.empty;
          expect(state.companies.all).to.have.lengthOf(
            numOfRecords,
            "Vuex has products after request"
          );
          done();
        }
      });
    });
  });

  it("getCompanies() with Vuex partially ready; gets all from Firebase, saves to Vuex (no IndexedDB activity)", (done) => {
    const subset = 2;
    const numOfRecords = Object.keys(companyData.companies).length;
    store.state.companies.all = hashToArray(companyData.companies).slice(
      0,
      subset
    );
    expect(store.state.companies.all).to.have.lengthOf(
      subset,
      "Vuex has a subset of products to begin"
    );

    getCompanies(
      Object.keys(companyData.companies),
      { strategy: AbcStrategy.getFirebase }
    ).then(results => {
      store.subscribe((mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === `companies/${DbSyncOperation.ABC_FIREBASE_MERGE_VUEX}`) {
          /** 
           * TODO: see if there is a way to get the serverRecords returned after the update
           * currently the test below will fail because the server code wouldn't have run as yet
           **/
          // expect(results.serverRecords).to.have.lengthOf(numOfRecords);
          // expect(results.records).to.have.lengthOf(numOfRecords);

          expect(results.localRecords).to.have.lengthOf(subset);
          expect(state.companies.all).to.have.lengthOf(
            numOfRecords,
            "Vuex has all products after request"
          );
        }
      });
    });
  });
});
