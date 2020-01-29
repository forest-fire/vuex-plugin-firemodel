import { expect } from 'chai';
import { Person } from './models/Person'
import { abc, since, database } from '../src/index';
import { FireModel } from 'firemodel';
import { AbcApi } from '../src/abc/api/AbcApi';
import { fakeIndexedDb } from './helpers/fakeIndexedDb';
import { Company } from './models/Company';
import { DB } from 'abstracted-client';
import { productData } from './data/productData';
import { IRootState } from './store/index';
import { Product } from './models/Product';
import { Store } from 'vuex';

describe('ABC API Interaction with IndexedDB Model => ', () => {
  let store: Store<IRootState>;
  let getProducts: any;

  beforeEach(async () => {
    await fakeIndexedDb();
    AbcApi.clear();
    store = (await import('./store')).setupStore(productData);
    getProducts = (await import('./store')).getProducts;
  })

  it.only('getProducts() with empty IndexedDB gets results from Firebase, saves to both IndexedDb and Vuex', async () => {

    // Product is configured for ABC
    expect(AbcApi.configuredModels).contains('Product');
    // Vuex has no Products yet
    expect(store.state.products.all).to.have.lengthOf(0);
    // IndexedDB has no Products yet
    const api = AbcApi.getModelApi(Product);
    await api.connectDexie();
    const idxProducts = await api.dexieList.all();
    expect(idxProducts).has.lengthOf(0);

    // calling discrete GET results in Firebase call and population of both Vuex and IndexedDB
    const products: Product[] = await getProducts(Object.keys(productData.products));
    expect(products.length).to.equal(Object.keys(productData.products).length);

  });

  it('getProducts() with all products in IndexedDb returns full cache hit rate; Firebase not called', async () => {
    throw new Error('test not written');
  });

  it('getProducts() with partial products in IndexedDb returns partial cache hit rate; Firebase called for missing', async () => {
    throw new Error('test not written');
  });

  it('getProducts() with all products in IndexedDb and "getStrategy = refresh" results in cache hit but Firebase called afterwards', async () => {
    throw new Error('test not written');
  });

  it('loadProducts() with "loadStrategy = cache" always goes to Firebase for results and then refreshes IndexedDB', async () => {
    throw new Error('test not written');
  })

  it('loadProducts() with "loadStrategy = all" option set to true loads documents into both IndexedDB and Vuex"', async () => {
    throw new Error('test not written');
  });


})

describe('ABC API Interaction with Model with no cache layer => ', () => {

  it('getCompanies() gets results from Firebase, saves to Vuex (no IndexedDB activity)', async () => {
    throw new Error('test not written');
  })

  it('getCompanies() results in error when setting "getStrategy" to "refresh" ', async () => {
    throw new Error('test not written');
  })

})