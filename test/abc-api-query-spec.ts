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
    await AbcApi.disconnect();
    AbcApi.clear();
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

  it("get.all() when local has partial result", async () => {
    throw new Error("test not written");
  });

  it("get.all() when local has all records", async () => {
    throw new Error("test not written");
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

function clearSubscription() {
  events = [];
  eventCounts = {};
}
