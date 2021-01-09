import type { IAbcRequest } from '@/types';

import { Company } from './models/Company';
import { IRootState } from './store';
import { Person } from './models/Person';
import { Store } from 'vuex';
import { fakeIndexedDb } from './helpers/fakeIndexedDb';
import { abc, AbcApi } from '@/abc';

describe('ABC API Basics => ', () => {
  let store: Store<IRootState>;
  let getPerson: IAbcRequest<Person>;
  let loadPerson: IAbcRequest<Person>;
  let getCompanies: IAbcRequest<Company>;
  let loadCompanies: IAbcRequest<Company>;

  beforeEach(async () => {
    await fakeIndexedDb();
    store = (await import('./store')).setupStore();
    [getPerson, loadPerson] = abc(Person);
    [getCompanies, loadCompanies] = abc(Company, { useIndexedDb: false });
    await AbcApi.connectIndexedDb();
    // TODO: find a better solution to get the mock database reset
    expect(AbcApi.getModelApi(Person).db.isConnected);
    expect(AbcApi.getModelApi(Company).db.isConnected);
    expect(AbcApi.indexedDbConnected).toBe(true);
  });

  afterEach(async () => {
    await AbcApi.clear();
  });

  it('Instantiating returns ABC API surface', () => {
    const api = AbcApi.getModelApi(Person);
    expect(api).toBeInstanceOf(AbcApi);

    expect(api.about.model.pascal).toBe('Person');
    expect(api.cachePerformance.hits).toBe(0);
    expect(api.cachePerformance.misses).toBe(0);

    expect(AbcApi.configuredFiremodelModels).toEqual(expect.arrayContaining(['Person']));

    expect(api.get).toBeInstanceOf(Function);
    expect(api.load).toBeInstanceOf(Function);
    expect(api.watch).toBeInstanceOf(Function);
  });

  it("Calling abc() returns get, load, and watch API's of ABC API", () => {
    expect(getPerson).toBeInstanceOf(Function);
    expect(loadPerson).toBeInstanceOf(Function);
  });

  it('Prior to using a get/load API the IndexedDB is not openned but models with indexedDb are known', () => {
    expect(AbcApi.configuredFiremodelModels).toEqual(expect.arrayContaining(['Person']));
    expect(AbcApi.configuredFiremodelModels).toEqual(expect.arrayContaining(['Company']));
  });

  it('Connecting IndexedDB after at least one valid Model works and can call dexieTable() on instance', async () => {
    const peeps = AbcApi.getModelApi(Person);
    expect(peeps.dexieTable.get).toBeInstanceOf(Function);
  });

  it('Connecting to IndexedDB and then trying to get table of model not included fails', async () => {
    const companies = AbcApi.getModelApi(Company);
    expect(AbcApi.indexedDbConnected).toBe(true);

    try {
      companies.dexieTable;
      throw new Error('companies should NOT be part of the models managed by Dexie/IndexedDB');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toContain('You are attempting to access Dexie while connected');
    }
  });

  it('After connecting to IndexedDB, can access dexieList property and gain access to the Dexie List API', async () => {
    const peeps = AbcApi.getModelApi(Person);
    expect(peeps.dexieList).toBeDefined();
    expect(peeps.dexieList.all).toBeInstanceOf(Function);
    expect(peeps.dexieList.since).toBeInstanceOf(Function);
  });

  it('After connecting to IndexedDB, can access dexieRecord property and gain access to the Dexie Record API', async () => {
    const peeps = AbcApi.getModelApi(Person);
    await AbcApi.connectIndexedDb();
    expect(peeps.dexieRecord).toBeDefined();
    expect(peeps.dexieRecord.get).toBeInstanceOf(Function);
    expect(peeps.dexieRecord.update).toBeInstanceOf(Function);
  });
});
