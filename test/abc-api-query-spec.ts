import {
  all,
  AbcApi,
  IAbcRequest,
  getStore,
  IAbcQueryRequest,
  AbcResult
} from "../src/index";
import { expect } from "chai";
import { Product } from "./models/Product";
import { Store, MutationPayload } from "vuex";
import { IRootState } from "./store";
import { fakeIndexedDb } from "./helpers/fakeIndexedDb";
import { productData } from "./data/productData";
import { IDictionary } from "firemock";
import { hashToArray } from "typed-conversions";

describe("ABC API Query - with a model with IndexedDB support => ", () => {
  let store: Store<IRootState>;
  let getProducts: IAbcRequest<Product>;
  let loadProducts: IAbcRequest<Product>;

  before(async () => {
    await fakeIndexedDb();
  });

  beforeEach(async () => {
    store = (await import("./store")).setupStore(productData);
    const abc = (await import("./store")).getAbc();
    getProducts = abc.getProducts;
    loadProducts = abc.loadProducts;
    await AbcApi.connectIndexedDb();
    expect(AbcApi.getModelApi(Product).db.isConnected);
  });

  afterEach(async () => {
    store.state.products.all = [];
    await AbcApi.clear();
    clearSubscription();
  });

  it("get.all() when local state is empty", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");
    expect(events).to.have.lengthOf(0, "No dispatches yet");

    const q: IAbcQueryRequest<Product> = all();
    const results = await getProducts(q);

    expect(results).to.instanceOf(
      AbcResult,
      "result is an instance of AbcResult"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );
    expect(results.localRecords).to.have.lengthOf(
      0,
      "No records should be coming locally"
    );
  });

  it("get.all() when local has partial result where lastUpdated is slightly behind server", async () => {
    const store = getStore();
    const partialProducts = hashToArray(productData.products)
      .slice(0, 2)
      .map(i => ({ ...i, lastUpdated: i.lastUpdated - 1 }));
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(partialProducts);

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(
      partialProducts.length,
      "IndexedDB has some products"
    );

    expect(events).to.have.lengthOf(0, "No dispatches yet");

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
    expect(results.serverRecords).to.have.lengthOf(
      numProducts,
      "server records have all records in sample dataset"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );

    const firstId = partialProducts[0].id;
    expect(
      results.localRecords.find(i => i.id === firstId).lastUpdated
    ).is.lessThan(
      results.records.find(i => i.id === firstId).lastUpdated,
      "The result has a more recent lastUpdated date than the cached value (aka, it accepts server values as more valid)"
    );

    expect(
      store.state.products.all.find(i => i.id === firstId).lastUpdated
    ).to.equal(
      results.records.find(i => i.id === firstId).lastUpdated,
      "Vuex should be updated with the records as well"
    );
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

    expect(events).to.have.lengthOf(0, "No dispatches yet");

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
    expect(results.serverRecords).to.have.lengthOf(
      numProducts,
      "server records have all records in sample dataset"
    );

    expect(results.records).to.have.lengthOf(
      numProducts,
      "overall results should have all DB records"
    );
  });

  it("get.where() when local state is empty", async () => {
    throw new Error("test not written");
  });

  it("get.where() when local has all records", async () => {
    throw new Error("test not written");
  });

  it("get.since(timestamp) when local state is empty", async () => {
    throw new Error("test not written");
  });

  it("get.since(timestamp) when local state has all records", async () => {
    throw new Error("test not written");
  });

  it("load.since(timestamp) when local state is empty", async () => {
    throw new Error("test not written");
  });

  it("load.since() when local state is empty", async () => {
    throw new Error("test not written");
  });
});

let events: Array<[string, IDictionary]> = [];
let eventCounts: IDictionary<number> = {};

function subscription(mutation: MutationPayload, state: IDictionary): void {
  if (!eventCounts[mutation.payload]) {
    eventCounts[mutation.payload] = 1;
  } else {
    eventCounts[mutation.payload]++;
  }

  events.push([mutation.payload, state]);
}

/**
 * Resets counters for Mutation tracking
 */
function clearSubscription() {
  events = [];
  eventCounts = {};
}
