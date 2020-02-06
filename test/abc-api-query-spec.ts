import {
  all,
  AbcApi,
  IAbcRequest,
  getStore,
  IAbcQueryRequest,
  AbcResult,
  AbcMutation,
  where
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

    expect(eventCounts[`products/ABC_LOCAL_QUERY_EMPTY`]).to.equal(1);
    expect(eventCounts["products/ABC_FIREBASE_TO_VUEX_UPDATE"]).to.equal(1);
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
      results.localRecords.find(i => i.id === firstId)?.lastUpdated as number
    ).is.lessThan(
      results.records?.find(i => i.id === firstId)?.lastUpdated as number,
      "The result has a more recent lastUpdated date than the cached value (aka, it accepts server values as more valid)"
    );

    expect(
      store.state.products.all.find((i: Product) => i.id === firstId)
        ?.lastUpdated as number
    ).to.equal(
      results.records.find(i => i.id === firstId)?.lastUpdated as number,
      "Vuex should be updated with the records as well"
    );

    expect(eventCounts[`products/ABC_LOCAL_QUERY_TO_VUEX`]).to.equal(1);
    expect(eventCounts["products/ABC_FIREBASE_TO_VUEX_UPDATE"]).to.equal(1);
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
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).to.have.lengthOf(0, "Vuex starts empty");
    expect(await tbl.toArray()).to.have.lengthOf(0, "IndexedDB starts empty");
    expect(events).to.have.lengthOf(0, "No dispatches yet");

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
      0,
      "No records should be coming locally"
    );

    results.records.forEach(r => expect(r.price).to.equal(452));

    expect(eventCounts[`products/ABC_LOCAL_QUERY_EMPTY`]).to.equal(1);
    expect(eventCounts["products/ABC_FIREBASE_TO_VUEX_UPDATE"]).to.equal(1);
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
    expect(events).to.have.lengthOf(0, "No dispatches yet");

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
    expect(results.serverRecords).to.have.lengthOf(
      2,
      "The server should have the two records retrieved from server"
    );
    expect(results.records).to.have.lengthOf(
      2,
      "overall records should have the two records retrieved from server"
    );

    results.records.forEach(r => expect(r.price).to.equal(452));

    expect(eventCounts[`products/ABC_LOCAL_QUERY_TO_VUEX`]).to.equal(1);
    expect(eventCounts["products/ABC_FIREBASE_TO_VUEX_UPDATE"]).to.equal(1);
  });

  it("get.where() when local has more records", async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(
      hashToArray(productData.products).concat({
        id: "zzzz2",
        price: 452,
        name: "An old product",
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
    expect(events).to.have.lengthOf(0, "No dispatches yet");

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
      3,
      "Locally we should have the two records that the server PLUS the additional one"
    );
    expect(results.serverRecords).to.have.lengthOf(
      2,
      "The server should have the two records retrieved from server"
    );
    expect(results.records).to.have.lengthOf(
      2,
      "overall records should have the two records retrieved from server"
    );

    expect(eventCounts[`products/ABC_LOCAL_QUERY_TO_VUEX`]).to.equal(1);
    expect(eventCounts["products/ABC_FIREBASE_TO_VUEX_UPDATE"]).to.equal(1);
    // expect(eventCounts["products/ABC_PRUNE_STALE_VUEX_RECORDS"]).to.equal(
    //   1,
    //   "Pruning of stale Vuex records has happened"
    // );
    // expect(eventCounts["products/ABC_PRUNE_STALE_IDX_RECORDS"]).to.equal(
    //   1,
    //   "Pruning of stale IDX records has happened"
    // );

    // ApiResult.records have only products priced at 452
    results.records.forEach(r => expect(r.price).to.equal(452));
    // Same with the Vuex state
    store.state.products.all.forEach((r: Product) =>
      expect(r.price).to.equal(452)
    );

    console.log(
      events.find(i => i[0] === "products/ABC_PRUNE_STALE_VUEX_RECORDS")
    );

    // Vuex should also ONLY have those records which came back from Server
    expect(store.state.products.all).to.have.lengthOf(2);

    const localMutation = events.find(
      i => i[0] === "products/ABC_LOCAL_QUERY_TO_VUEX"
    );
    if (localMutation) {
      expect(localMutation[1].localRecords).to.have.lengthOf(3);
      expect(localMutation[1].serverRecords).to.have.lengthOf(0);
    } else {
      throw new Error("local mutation was incorrectly structured");
    }
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

let events: Array<[string, AbcResult<Product>]> = [];
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
