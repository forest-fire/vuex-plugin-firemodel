import { AbcApi, AbcResult } from '@/abc';
import type { IAbcRequest } from '@/types';
import { MutationPayload, Store } from 'vuex';

import { Company } from './models/Company';
import { IDictionary } from 'common-types';
import { IRootState } from './store/index';
import { Product } from './models/Product';
import { companyData } from './data/companyData';
import { fakeIndexedDb } from './helpers/fakeIndexedDb';
import { getStore } from '@/util';
import { hashToArray } from 'typed-conversions';
import { productData } from './data/productData';
import { AbcStrategy, DbSyncOperation } from '@/enums';

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
    ...productData,
  });
}

describe('ABC API Discrete - with a model with IndexedDB support => ', () => {
  let store: Store<IRootState>;
  let getProducts: IAbcRequest<Product>;
  let loadProducts: IAbcRequest<Product>;

  beforeEach(async () => {
    await fakeIndexedDb();
    store = (await import('./store')).setupStore();
    const abc = (await import('./store')).getAbc();
    getProducts = abc.getProducts;
    loadProducts = abc.loadProducts;
    await AbcApi.connectIndexedDb();
    store.state.products.all = [];
    expect(AbcApi.getModelApi(Product).db.isConnected);
    expect(AbcApi.indexedDbConnected).toBe(true);
  });

  afterEach(async () => {
    await AbcApi.getModelApi(Product).dexieTable.clear();
    await AbcApi.clear();
    clearSubscription();
  });

  it('load.discrete(product) returns results from firebase into indexedDB but not vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    await addProductsToIndexedDB();
    const results = await loadProducts(Object.keys(productData.products));

    expect(results).toBeInstanceOf(AbcResult);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(results.serverRecords).toHaveLength(numProducts);

    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBeUndefined();
  });

  it('load.discrete(product) with loadVuex strategy returns results from indexedDB/firebase into vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    await addProductsToIndexedDB();
    const results = await loadProducts(Object.keys(productData.products), {
      strategy: AbcStrategy.loadVuex,
    });

    expect(results).toBeInstanceOf(AbcResult);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(results.serverRecords).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(numProducts);

    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBe(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).toBe(1);
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]
    ).toBeUndefined();
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]
    ).toBeUndefined();
  });

  it('load.discrete(product) with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;
    await addProductsToMockDB();

    const numProducts = Object.keys(productData.products).length;
    // start with empty Vuex and IndexedDB state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    await addProductsToIndexedDB();
    const results = await loadProducts(Object.keys(productData.products), {
      strategy: AbcStrategy.loadVuex,
    });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(numProducts);

    // update DB
    const newPrice = 430;
    const mockDbProducts = productData.products;
    const updatedProduct = Object.values(mockDbProducts)
      .filter((p: Product) => p.id === 'abcd')
      .map((p) => ({ ...p, price: newPrice }));

    db.mock.updateDB({
      products: {
        abcd: updatedProduct[0],
      },
    });

    // load existing products into Vuex state again
    const discreteResult = await loadProducts([updatedProduct[0].id], {
      strategy: AbcStrategy.loadVuex,
    });

    /**
     * TODO: looks like the lastUpdated has been modified in IndexedDB
     * for products that weren't modified. Need to look into this.
     **/
    expect(discreteResult.records).toHaveLength(1);

    expect(store.state.products.all).toHaveLength(numProducts);

    const abcdProductInStore = store.state.products.all.find((p: Product) => p.id === 'abcd');

    expect(abcdProductInStore.price).toBe(newPrice);

    const abcdProductInCache = (await tbl.where({ id: 'abcd' }).first()) || { price: 0 };
    expect(abcdProductInCache.price).toBe(newPrice);

    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBe(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).toBe(2);
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]
    ).toBeUndefined();
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]
    ).toBeUndefined();
  });

  it('get.discrete(product) returns results from indexedDB into vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const abcdProduct = Object.values(productData.products).find(
      (p: Product) => p.id === 'abcd'
    ) || { id: '1234' };
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    await addProductsToIndexedDB();
    const results = await getProducts([abcdProduct.id]);

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(1);

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).toBe(1);
  });

  it('get.discrete(product) with getFirebase strategy returns results from firebase into indexedDB', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const abcdProduct = Object.values(productData.products).find(
      (p: Product) => p.id === 'abcd'
    ) || { id: '1234' };
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    await addProductsToIndexedDB();
    const results = await getProducts([abcdProduct.id]);

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(1);

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).toBe(1);
  });
});

describe('ABC API Discrete - queries a Model with no IndexedDB layer => ', () => {
  let store: Store<IRootState>;
  let getCompanies: IAbcRequest<Company>;
  let loadCompanies: IAbcRequest<Company>;

  beforeEach(async () => {
    await fakeIndexedDb();
    store = (await import('./store')).setupStore(companyData);
    const abc = (await import('./store')).getAbc();
    getCompanies = abc.getCompanies;
    loadCompanies = abc.loadCompanies;
    await AbcApi.connectIndexedDb();
    store.state.companies.all = [];
  });

  afterEach(async () => {
    await AbcApi.clear();
  });

  it('getCompanies() with nothing in Vuex gets results from Firebase, saves to Vuex (no IndexedDB activity)', (done) => {
    const numOfRecords = Object.keys(companyData.companies).length;
    expect(store.state.companies.all).toHaveLength(0);

    getCompanies(Object.keys(companyData.companies), { strategy: AbcStrategy.getFirebase }).then(
      (results) => {
        store.subscribe((mutation: MutationPayload, state: IDictionary) => {
          if (mutation.type === `companies/${DbSyncOperation.ABC_FIREBASE_MERGE_VUEX}`) {
            expect(results.records).toHaveLength(0);
            expect(state.companies.all).toHaveLength(numOfRecords);
            done();
          }
        });
      }
    );
  });

  it.skip('getCompanies() with Vuex partially ready; gets all from Firebase, saves to Vuex (no IndexedDB activity)', (done) => {
    const subset = 2;
    const numOfRecords = Object.keys(companyData.companies).length;
    store.state.companies.all = hashToArray(companyData.companies).slice(0, subset);
    expect(store.state.companies.all).toHaveLength(subset);

    // getCompanies(
    //   Object.keys(companyData.companies),
    //   { strategy: AbcStrategy.getFirebase }
    // ).then(results => {
    //   store.subscribe((mutation: MutationPayload, state: IDictionary) => {
    //     if (mutation.type === `companies/${DbSyncOperation.ABC_FIREBASE_MERGE_VUEX}`) {
    //       /**
    //        * TODO: see if there is a way to get the serverRecords returned after the update
    //        * currently the test below will fail because the server code wouldn't have run as yet
    //        **/
    //       // expect(results.serverRecords).to.have.lengthOf(numOfRecords);
    //       // expect(results.records).to.have.lengthOf(numOfRecords);

    //       expect(results.localRecords).toHaveLength(subset);
    //       expect(state.companies.all).toHaveLength(numOfRecords);
    //     }
    //   });
    // });
  });
});
