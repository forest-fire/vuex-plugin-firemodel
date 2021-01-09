import { AbcApi, AbcResult, all, saveToIndexedDb, since, where } from '@/abc';
import type { IAbcQueryRequest, IAbcRequest, IQueryServerResults } from '@/types';
import { FireModel, IPrimaryKey, List, Model, Record } from 'firemodel';
import { MutationPayload, Store } from 'vuex';

import Dexie from 'dexie';
import { IDictionary } from 'common-types';
import { IRootState } from './store';
import { Mock } from 'firemock';
import { Order } from './models/Order';
import { Product } from './models/Product';
import { fakeIndexedDb } from './helpers/fakeIndexedDb';
import { getStore } from '@/util';
import { hashToArray } from 'typed-conversions';
import { orderData } from './data/orderData';
import { productData } from './data/productData';
import { productDataExtra } from './data/productDataExtra';
import { DbSyncOperation, AbcStrategy } from '@/enums';

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
    },
  };
  await saveToIndexedDb(server, tbl);
}

interface ProductData {
  products: Product[];
  totalProducts: number;
}

function addNewProductsToMockDB(mock: Mock): ProductData {
  const mockDbProducts = mock.db.products;
  const productsNew = productDataExtra.products;
  const products: Product[] = {
    ...mockDbProducts,
    ...productsNew,
  };

  mock.updateDB({ products }, true);

  return {
    products: mock.db.products,
    totalProducts: Object.keys(mock.db.products).length,
  };
}

describe('ABC API Query - with a model with IndexedDB support => ', () => {
  let store: Store<IRootState>;
  let getProducts: IAbcRequest<Product>;
  let loadProducts: IAbcRequest<Product>;
  let getOrders: IAbcRequest<Order>;
  let loadOrders: IAbcRequest<Order>;

  beforeEach(async () => {
    await fakeIndexedDb();
    store = (await import('./store')).setupStore();
    const abc = (await import('./store')).getAbc();
    getProducts = abc.getProducts;
    loadProducts = abc.loadProducts;
    getOrders = abc.getOrders;
    loadOrders = abc.loadOrders;
    await AbcApi.connectIndexedDb();
    // TODO: find a better solution to get the mock database reset
    FireModel.defaultDb.mock.updateDB({ ...productData, ...orderData }, true);
    expect(AbcApi.getModelApi(Product).db.isConnected);
    expect(AbcApi.getModelApi(Order).db.isConnected);
    expect(AbcApi.indexedDbConnected).toBe(true);
    store.state.products.all = [];
  });

  afterEach(async () => {
    await AbcApi.getModelApi(Product).dexieTable.clear();
    await AbcApi.clear();
    clearSubscription();
  });

  it('get.all() returns results from indexedDB into Vuex', async () => {
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

    expect(eventCounts['products/ABC_INDEXED_DB_SET_VUEX']).toBe(1);
  });

  it('get.all() when local has partial result', async () => {
    const store = getStore();
    const partialProducts = hashToArray(productData.products)
      .slice(0, 2)
      .map((i) => ({ ...i, lastUpdated: i.lastUpdated - 1 }));
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
      store.state.products.all.find((i: Product) => i.id === firstId)?.lastUpdated as number
    ).toBe(results.records.find((i) => i.id === firstId)?.lastUpdated as number);

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).toBe(1);
  });

  it('get.all() when indexedDB has all records', async () => {
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

  it('get.all() return results from firebase into indexedDB/Vuex', (done) => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    expect(Object.keys(db.mock.db.products)).toHaveLength(numProducts);
    expect(store.state.products.all).toHaveLength(0);

    getProducts(all(), { strategy: AbcStrategy.getFirebase }).then(async (results) => {
      expect(await tbl.toArray()).toHaveLength(0);

      expect(results).toBeInstanceOf(AbcResult);

      store.subscribe(async (mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === `products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`) {
          expect(await tbl.toArray()).toHaveLength(numProducts);

          expect(state.products.all).toHaveLength(numProducts);
          done();
        }
      });
    });
  });

  it('get.where() when local state is empty', async () => {
    const store = getStore();
    const products = hashToArray(productData.products).map((i) => ({
      ...i,
      lastUpdated: i.lastUpdated - 1,
    }));
    store.subscribe(subscription);

    const tbl = AbcApi.getModelApi(Product).dexieTable;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);
    await tbl.bulkPut(products);

    // Get server data and populate indexedDB
    const q: IAbcQueryRequest<Product> = where({
      property: 'price',
      equals: 452,
    });
    const results = await getProducts(q).catch((e) => {
      console.log(e);
      throw e;
    });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(2);
    expect(results.localRecords).toHaveLength(2);

    results.records.forEach((r) => expect(r.price).toBe(452));

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).toBe(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBeUndefined();
  });

  it('get.where() when local has all records', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(hashToArray(productData.products));
    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(numProducts);

    const results = await getProducts(
      where({
        property: 'price',
        equals: 452,
      })
    );

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.localRecords).toHaveLength(2);
    expect(results.serverRecords).toBeUndefined();
    expect(results.records).toHaveLength(2);

    results.records.forEach((r) => expect(r.price).toBe(452));

    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).toBe(1);
  });

  it('get.where() return results from firebase into indexedDB/Vuex', (done) => {
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    const numProductsFromQuery = Object.values(productData.products).filter(
      (p: Product) => p.price === 452
    ).length;
    expect(Object.keys(db.mock.db.products)).toHaveLength(numProducts);
    expect(store.state.products.all).toHaveLength(0);

    getProducts(
      where({
        property: 'price',
        equals: 452,
      }),
      { strategy: AbcStrategy.getFirebase }
    ).then(async (results) => {
      expect(await tbl.toArray()).toHaveLength(0);

      expect(results).toBeInstanceOf(AbcResult);

      store.subscribe(async (mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === `products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`) {
          expect(await tbl.toArray()).toHaveLength(numProductsFromQuery);

          expect(state.products.all).toHaveLength(numProductsFromQuery);
          done();
        }
      });
    });
  });

  it('get.all() with watch return results from firebase into indexedDB/Vuex', (done) => {
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    expect(Object.keys(db.mock.db.products)).toHaveLength(numProducts);
    expect(store.state.products.all).toHaveLength(0);

    getProducts(all(), { strategy: AbcStrategy.getFirebase, watch: true }).then(async (results) => {
      expect(await tbl.toArray()).toHaveLength(0);

      expect(results).toBeInstanceOf(AbcResult);
      store.subscribe(async (mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === '@firemodel/WATCHER_STARTED') {
          const { watching } = state['@firemodel'];
          expect(watching[0].watcherPaths).toHaveLength(1);
          expect(Array.isArray(watching[0].watcherPaths)).toBeTruthy();
          done();
        }

        if (mutation.type === `products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`) {
          expect(await tbl.toArray()).toHaveLength(numProducts);

          expect(state.products.all).toHaveLength(numProducts);

          const name = 'Eves Apple';
          await Record.update(Product, 'aaaa', {
            name,
          });
          expect(state.products.all[1].name).toBe(name);
        }
      });
    });
  });

  it('get.where() with watch return results from firebase into indexedDB/Vuex', (done) => {
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    const numProductsFromQuery = Object.values(productData.products).filter(
      (p: Product) => p.price === 452
    ).length;
    expect(Object.keys(db.mock.db.products)).toHaveLength(numProducts);
    expect(store.state.products.all).toHaveLength(0);

    const watch = (p: Product) => [452].includes(p.price);
    getProducts(
      where({
        property: 'price',
        equals: 452,
      }),
      { strategy: AbcStrategy.getFirebase, watch }
    ).then(async (results) => {
      expect(await tbl.toArray()).toHaveLength(0);

      expect(results).toBeInstanceOf(AbcResult);
      store.subscribe(async (mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === '@firemodel/WATCHER_STARTED') {
          const { watching } = state['@firemodel'];
          expect(watching[0].watcherPaths).toHaveLength(2);
          expect(Array.isArray(watching[0].watcherPaths)).toBeTruthy();
          expect(watching[0].watcherPaths).toEqual(['/products/aaaa', '/products/bbbb']);
          done();
        }

        if (mutation.type === `products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`) {
          expect(await tbl.toArray()).toHaveLength(numProductsFromQuery);

          expect(state.products.all).toHaveLength(numProductsFromQuery);

          const name = 'Eves Apple';
          await Record.update(Product, 'aaaa', {
            name,
          });
          expect(state.products.all[0].name).toBe(name);
        }
      });
    });
  });

  it('get.where() with watch return results from firebase into indexedDB/Vuex', (done) => {
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    const numProductsFromQuery = Object.values(productData.products).filter(
      (p: Product) => p.price === 452
    ).length;
    expect(Object.keys(db.mock.db.products)).toHaveLength(numProducts);
    expect(store.state.products.all).toHaveLength(0);

    getProducts(
      where({
        property: 'price',
        equals: 452,
      }),
      { strategy: AbcStrategy.getFirebase, watch: true }
    ).then(async (results) => {
      expect(await tbl.toArray()).toHaveLength(0);

      expect(results).toBeInstanceOf(AbcResult);
      store.subscribe(async (mutation: MutationPayload, state: IDictionary) => {
        if (mutation.type === '@firemodel/WATCHER_STARTED') {
          const { watching } = state['@firemodel'];
          expect(watching[0].watcherPaths).toHaveLength(1);
          expect(Array.isArray(watching[0].watcherPaths)).toBeTruthy();
          expect(watching[0].watcherPaths).toEqual(['/products']);
          done();
        }

        if (mutation.type === `products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`) {
          expect(await tbl.toArray()).toHaveLength(numProductsFromQuery);

          expect(state.products.all).toHaveLength(numProductsFromQuery);

          const name = 'Eves Apple';
          await Record.update(Product, 'aaaa', {
            name,
          });
          expect(state.products.all[0].name).toBe(name);
        }
      });
    });
  });

  it.skip('get.where() when local has more records', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    await tbl.bulkPut(
      hashToArray(productData.products).concat({
        id: 'zzzz2',
        price: 452,
        name: 'An old product',
        store: '1234',
        lastUpdated: 1,
        createdAt: 1,
      })
    );
    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(numProducts + 1);

    const results = await getProducts(
      where({
        property: 'price',
        equals: 452,
      }),
      { strategy: AbcStrategy.getFirebase }
    );

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.localRecords).toHaveLength(2);
    expect(results.serverRecords).toBeUndefined();
    expect(results.records).toHaveLength(2);

    // expect(eventCounts[`products/ABC_LOCAL_QUERY_TO_VUEX`]).to.equal(1);
    expect(eventCounts[`products/${DbSyncOperation.ABC_INDEXED_DB_SET_VUEX}`]).toBe(1);

    // ApiResult.records have only products priced at 452
    results.records.forEach((r) => expect(r.price).toBe(452));
    // Same with the Vuex state
    store.state.products.all.forEach((r: Product) => expect(r.price).toBe(452));

    /* const pruneVuex = events.find(
      i => i[0] === "products/ABC_PRUNE_STALE_VUEX_RECORDS"
    );
    if (pruneVuex) {
      expect(pruneVuex[1].pks).to.be.an("array");
      expect(pruneVuex[1].pks).to.include("zzzz2");
    } */

    // Vuex should also ONLY have those records which came back from Server
    expect(store.state.products.all).toHaveLength(2);

    const localMutation = events.find((i) => i[0] === 'products/ABC_LOCAL_QUERY_TO_VUEX');
    if (localMutation) {
      expect(localMutation[1].localRecords).toHaveLength(3);
      expect(localMutation[1].serverRecords).toHaveLength(0);
    } else {
      throw new Error('local mutation was incorrectly structured');
    }
  });

  it.skip('get.since(timestamp) when local state is empty', async () => {
    throw new Error('test not written');
  });

  it.skip('get.since(timestamp) when local state has all records', async () => {
    throw new Error('test not written');
  });

  it('load.all() returns results from firebase into indexedDB', async () => {
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
    expect(eventCounts['products/ABC_INDEXED_DB_SET_VUEX']).toBeUndefined();
  });

  it('load.all() with loadVuex strategy returns results from indexedDB/firebase into vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const numProducts = Object.keys(productData.products).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(all(), { strategy: AbcStrategy.loadVuex });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

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

  it('load.all() with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const numProducts = Object.keys(productData.products).length;
    // start with empty Vuex and IndexedDB state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(all(), { strategy: AbcStrategy.loadVuex });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(numProducts);
    // Update Firebase mock database
    const { totalProducts } = addNewProductsToMockDB(db.mock);

    // load more products into Vuex state
    await loadProducts(all(), { strategy: AbcStrategy.loadVuex });

    expect(store.state.products.all).toHaveLength(totalProducts);
    expect(await tbl.toArray()).toHaveLength(totalProducts);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBe(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).toBe(2);
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]
    ).toBeUndefined();
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]
    ).toBeUndefined();
  });

  it('load.all() returns results from firebase into indexedDB (dynamic model)', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Order).dexieTable;

    const numOrders = Object.keys(orderData.store[1234].orders).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadOrders(all(), { offsets: { store: '1234' } });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numOrders);

    expect(store.state.products.all).toHaveLength(0);
    expect(eventCounts['products/ABC_INDEXED_DB_SET_VUEX']).toBeUndefined();
  });

  it('load.all() with loadVuex strategy returns results from indexedDB/firebase into vuex (dynamic model)', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Order).dexieTable;

    const numOrders = Object.keys(orderData.store[1234].orders).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadOrders(all(), {
      offsets: { store: '1234' },
      strategy: AbcStrategy.loadVuex,
    });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numOrders);

    expect(store.state.orders.all).toHaveLength(numOrders);
    expect(eventCounts['orders/ABC_INDEXED_DB_SET_VUEX']).toBe(1);
  });

  it.skip('load.all() with loadVuex strategy returns results from indexedDB/firebase into vuex (dynamic model) with existing data in vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Order).dexieTable;

    const numOrders = Object.keys(orderData.store[1234].orders).length;
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB and vuex
    const results = await loadOrders(all(), {
      offsets: { store: '1234' },
      strategy: AbcStrategy.loadVuex,
    });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numOrders);

    expect(store.state.orders.all).toHaveLength(numOrders);

    // update mockDB
    // Get server data and populate indexedDB
    await loadOrders(all(), { offsets: { store: '1234' }, strategy: AbcStrategy.loadVuex });

    expect(eventCounts['orders/ABC_INDEXED_DB_SET_VUEX']).toBe(1);
  });

  it('load.where() returns results from firebase into indexedDB', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const selectedStore = Object.values(productData.products).filter((p) => p.store === '1234');
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(
      where({
        property: 'store',
        equals: '1234',
      })
    );

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(0);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBeUndefined();
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]
    ).toBeUndefined();
  });

  it('load.where() returns results from indexedDB/firebase into vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const selectedStore = Object.values(productData.products).filter((p) => p.store === '1234');
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(
      where({
        property: 'store',
        equals: '1234',
      }),
      { strategy: AbcStrategy.loadVuex }
    );

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);

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

  it('load.where() with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const selectedStore = Object.values(productData.products).filter((p) => p.store === '1234');
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(
      where({
        property: 'store',
        equals: '1234',
      }),
      { strategy: AbcStrategy.loadVuex }
    );

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(numProducts);

    // Update Firebase mock database
    const { products } = addNewProductsToMockDB(db.mock);
    const totalProducts = Object.values(products).filter((p) => p.store === '1234').length;

    // TODO: check if the indexedDB results are correct, should they be wiped when new data is requested from firebase?
    // load more products into Vuex state
    await loadProducts(
      where({
        property: 'store',
        equals: '1234',
      }),
      { strategy: AbcStrategy.loadVuex }
    );

    expect(store.state.products.all).toHaveLength(totalProducts);
    expect(await tbl.toArray()).toHaveLength(totalProducts);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBe(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).toBe(2);
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]
    ).toBeUndefined();
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]
    ).toBeUndefined();
  });

  it('load.since(timestamp) returns results from indexedDB', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;

    const timestamp = new Date('December 10, 2019').getTime();
    const selectedStore = Object.values(productData.products).filter(
      (p) => p.lastUpdated > timestamp
    );
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(since({ timestamp }));

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);
  });

  it('load.since(timestamp) returns results from indexedDB/firebase into vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const timestamp = new Date('December 10, 2019').getTime();
    const selectedStore = Object.values(productData.products).filter(
      (p) => p.lastUpdated > timestamp
    );
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB
    const results = await loadProducts(since({ timestamp }), { strategy: AbcStrategy.loadVuex });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(numProducts);
  });

  it('load.since(timestamp) with loadVuex strategy returns results from indexedDB/firebase into vuex with existing data in vuex', async () => {
    const store = getStore();
    store.subscribe(subscription);
    const tbl = AbcApi.getModelApi(Product).dexieTable;
    const db = AbcApi.getModelApi(Product).db;

    const timestamp = new Date('December 10, 2019').getTime();
    const selectedStore = Object.values(productData.products).filter(
      (p) => p.lastUpdated > timestamp
    );
    const numProducts = selectedStore.length;
    // start with empty Vuex state
    expect(store.state.products.all).toHaveLength(0);
    expect(await tbl.toArray()).toHaveLength(0);

    // Get server data and populate indexedDB and vuex
    const results = await loadProducts(since({ timestamp }), { strategy: AbcStrategy.loadVuex });

    expect(results).toBeInstanceOf(AbcResult);

    expect(results.records).toHaveLength(numProducts);

    expect(await tbl.toArray()).toHaveLength(numProducts);

    expect(store.state.products.all).toHaveLength(numProducts);

    // Update Firebase mock database
    const { products } = addNewProductsToMockDB(db.mock);
    const totalProducts = Object.values(products).filter(
      (p) => (p.lastUpdated || new Date().getTime()) > timestamp
    ).length;

    // TODO: check if the indexedDB results are correct, should they be wiped when new data is requested from firebase?
    // load more products into Vuex state
    await loadProducts(since({ timestamp }), { strategy: AbcStrategy.loadVuex });

    expect(store.state.products.all).toHaveLength(totalProducts);
    expect(await tbl.toArray()).toHaveLength(totalProducts);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_INDEXED_DB}`]).toBe(2);
    expect(eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_VUEX}`]).toBe(2);
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_MERGE_INDEXED_DB}`]
    ).toBeUndefined();
    expect(
      eventCounts[`products/${DbSyncOperation.ABC_FIREBASE_SET_DYNAMIC_PATH_INDEXED_DB}`]
    ).toBeUndefined();
  });

  it.skip('load.since() when local state is empty', async () => {
    throw new Error('test not written');
  });
});
