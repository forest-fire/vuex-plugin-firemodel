import { expect } from "chai";
import { AbcResult, IAbcRequest, getStore } from "../src/index";
import { AbcApi } from "../src/abc/api/AbcApi";
import { fakeIndexedDb } from "./helpers/fakeIndexedDb";
import { productData } from "./data/productData";
import { IRootState } from "./store/index";
import { Product } from "./models/Product";
import { Store } from "vuex";
import { hashToArray } from "typed-conversions";
import { companyData } from "./data/companyData";
import { Company } from "./models/Company";

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
    expect(AbcApi.getModelApi(Product).db.isConnected);
  });

  afterEach(async () => {
    store.state.products.all = [];
    await AbcApi.getModelApi(Product).dexieTable.clear();
    await AbcApi.clear();
  });

  it("getProducts() with empty IndexedDB gets results from Firebase, saves to both IndexedDb and Vuex", async () => {
    expect(AbcApi.configuredFiremodelModels).contains(
      "Product",
      "Product configred in IndexedDB"
    );
    expect(store.state.products.all).to.have.lengthOf(
      0,
      "Vuex Starting with no records"
    );

    const productModel = AbcApi.getModelApi(Product);
    const idxProducts = await productModel.dexieList.all().catch(e => {
      throw e;
    });
    expect(idxProducts).has.lengthOf(0, "IndexedDB starting with no records");

    const products: AbcResult<Product> = await getProducts(
      Object.keys(productData.products)
    );

    expect(products).to.be.a.instanceOf(
      AbcResult,
      "Result is a AbcResult class"
    );

    expect(products.records).to.have.lengthOf(
      Object.keys(productData.products).length,
      "Appropriate number of records returned"
    );
    expect(products.serverRecords).to.have.lengthOf(
      Object.keys(productData.products).length
    );
    expect(products.localRecords).to.have.lengthOf(0);

    // local storage has appropriate records
    const ids = Object.keys(productData.products);
    const storeIds = store.state.products.all.map(i => i.id);
    ids.forEach(id =>
      expect(storeIds).to.contain(id, "Vuex to have proper IDs")
    );

    const idxRecIds = (await productModel.dexieTable.toArray()).map(i => i.id);
    ids.forEach(id =>
      expect(idxRecIds).to.contain(id, "IndexedDB to have proper IDs")
    );
  });

  it("getProducts() with all products in IndexedDb returns full cache hit rate; Firebase not called", async () => {
    // addProductsToVuex();
    await addProductsToIndexedDB();

    expect(AbcApi.configuredFiremodelModels).contains(
      "Product",
      "Product is configured for IndexedDB"
    );
    expect(store.state.products.all).to.have.lengthOf(
      0,
      "Vuex has no records yet"
    );

    const productModel = AbcApi.getModelApi(Product);
    const idxProducts = await productModel.dexieList.all();
    expect(idxProducts).has.lengthOf(
      Object.keys(productData.products).length,
      "IndexedDB has correct number of records"
    );

    const products: AbcResult<Product> = await getProducts(
      Object.keys(productData.products)
    );
    const numOfRecords = Object.keys(productData.products).length;

    expect(products.records).to.have.lengthOf(
      numOfRecords,
      "correct number of records returned"
    );
    expect(products.localRecords).to.have.lengthOf(
      numOfRecords,
      "local records should have returned all the records"
    );
    expect(products.serverRecords).to.have.lengthOf(
      0,
      "server records should have returned nothing"
    );
    expect(products.cachePerformance.hits).to.equal(
      numOfRecords,
      "cachePerformance should recognize 100% hit rate"
    );
    expect(products.cachePerformance.misses).to.equal(
      0,
      "cachePerformance should recognize 0% miss rate"
    );
  });

  it("getProducts() with partial products in IndexedDb returns partial cache hit rate; Firebase called for all", async () => {
    await addProductsToIndexedDB(2);

    expect(AbcApi.configuredFiremodelModels).contains(
      "Product",
      "Product is configured for IndexedDB"
    );
    expect(store.state.products.all).to.have.lengthOf(
      0,
      "Vuex has no records yet"
    );

    const productModel = AbcApi.getModelApi(Product);
    const idxProducts = await productModel.dexieList.all();
    expect(idxProducts).has.lengthOf(
      2,
      "IndexedDB has correct number of records"
    );

    // call getProducts
    const products: AbcResult<Product> = await getProducts(
      Object.keys(productData.products)
    );
    const numOfRecords = Object.keys(productData.products).length;
    expect(products.records).to.have.lengthOf(
      numOfRecords,
      "correct number of records returned"
    );
    expect(products.localRecords).to.have.lengthOf(
      2,
      "local records should have returned all the records"
    );
    expect(products.serverRecords).to.have.lengthOf(
      numOfRecords,
      "server records returns all records (two new, two to refresh idx"
    );
    expect(products.cachePerformance.hits).to.equal(
      numOfRecords - 2,
      "cachePerformance should recognize 50% hit rate"
    );
    expect(products.cachePerformance.misses).to.equal(
      2,
      "cachePerformance should recognize 50% miss rate"
    );
  });

  it("getProducts() with all products in Vuex already, IndexedDB is empty", async () => {
    const numOfRecords = Object.keys(productData.products).length;
    store.state.products.all = hashToArray(productData.products);
    expect(store.state.products.all).to.have.lengthOf(
      numOfRecords,
      "Vuex has all products already"
    );

    const productModel = AbcApi.getModelApi(Product);
    const idxProducts = await productModel.dexieList.all();
    expect(idxProducts).has.lengthOf(0, "IndexedDB has no records");

    // call getProducts
    const products: AbcResult<Product> = await getProducts(
      Object.keys(productData.products)
    );

    expect(products.records).to.have.lengthOf(
      numOfRecords,
      "correct number of records returned"
    );

    expect(products.localRecords).to.have.lengthOf(
      numOfRecords,
      "local records should have returned all the records"
    );
    expect(products.serverRecords).to.have.lengthOf(
      0,
      "server records should have returned nothing"
    );
    expect(products.cachePerformance.hits).to.equal(
      numOfRecords,
      "cachePerformance should recognize 50% hit rate"
    );
    expect(products.cachePerformance.misses).to.equal(
      0,
      "cachePerformance should recognize 50% miss rate"
    );
  });

  it("loadProducts() loads all products from Firebase into IndexedDB but Vuex remains empty", async () => {
    const numOfRecords = Object.keys(productData.products).length;
    store.state.products.all = hashToArray(productData.products);
    expect(store.state.products.all).to.have.lengthOf(
      numOfRecords,
      "Vuex has all products already"
    );

    const productModel = AbcApi.getModelApi(Product);
    const idxProducts = await productModel.dexieList.all();
    expect(idxProducts).has.lengthOf(0, "IndexedDB has no records");

    // call getProducts
    const products: AbcResult<Product> = await loadProducts(
      Object.keys(productData.products)
    );

    expect(products.records).to.have.lengthOf(
      numOfRecords,
      "correct number of records returned"
    );

    expect(products.localRecords).to.have.lengthOf(
      numOfRecords,
      "local records should have returned all the records"
    );
    expect(products.serverRecords).to.have.lengthOf(
      0,
      "server records should have returned nothing"
    );
    expect(products.cachePerformance.hits).to.equal(
      numOfRecords,
      "cachePerformance should recognize 50% hit rate"
    );
    expect(products.cachePerformance.misses).to.equal(
      0,
      "cachePerformance should recognize 50% miss rate"
    );
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

  it("getCompanies() with nothing in Vuex gets results from Firebase, saves to Vuex (no IndexedDB activity)", async () => {
    try {
      const numOfRecords = Object.keys(companyData.companies).length;
      expect(store.state.companies.all).to.have.lengthOf(
        0,
        "Vuex has no products to start"
      );

      const results = await getCompanies(Object.keys(companyData.companies));
      expect(results.localRecords).to.have.lengthOf(0);
      expect(results.serverRecords).to.have.lengthOf(numOfRecords);
      expect(store.state.companies.all).to.have.lengthOf(
        numOfRecords,
        "Vuex has products after request"
      );
    } catch (e) {
      throw e;
    }
  });

  it("getCompanies() with Vuex partially ready; gets all from Firebase, saves to Vuex (no IndexedDB activity)", async () => {
    try {
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

      const results = await getCompanies(Object.keys(companyData.companies));
      expect(results.localRecords).to.have.lengthOf(subset);
      expect(results.serverRecords).to.have.lengthOf(numOfRecords);
      expect(results.records).to.have.lengthOf(numOfRecords);
      expect(store.state.companies.all).to.have.lengthOf(
        numOfRecords,
        "Vuex has all products after request"
      );
    } catch (e) {
      throw e;
    }
  });

  it("loadCompanies() results in error because model doesn't have IndexedDB config", async () => {
    try {
      const results = await loadCompanies(Object.keys(companyData.companies));
      throw new Error(
        "loadCompanies should fail as it does not have IndexedDB"
      );
    } catch (e) {
      expect(e.code).to.equal("not-allowed");
      expect(e.message).to.include("use getCompanies() instead");
    }
  });
});

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
