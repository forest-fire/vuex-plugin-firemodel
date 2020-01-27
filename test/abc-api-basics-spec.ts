import { expect } from 'chai';
import { Person } from './models/Person'
import { abc, since } from '../src/index'
import { AbcApi } from '../src/abc/api/AbcApi';
import { fakeIndexedDb } from './helpers/fakeIndexedDb';
import { Company } from './models/Company';

describe.only("ABC API Basics => ", () => {
  beforeEach(async () => {
    await fakeIndexedDb();
    AbcApi.clear();
  })

  it("Instantiating returns ABC API surface", () => {
    const api = new AbcApi(Person);
    expect(api).to.be.an.instanceOf(AbcApi);

    expect(api.about.model.pascal).to.equal('Person')
    expect(api.cachePerformance.hits).to.equal(0);
    expect(api.cachePerformance.misses).to.equal(0);

    expect(AbcApi.configuredModels).to.contain("Person");

    expect(api.get).is.a('function');
    expect(api.load).is.a('function');
    expect(api.watch).is.a('function');
  })


  it("Calling abc() returns get, load, and watch API's of ABC API", () => {
    const [getPerson, loadPerson, watchPerson] = abc(Person);
    expect(getPerson).to.be.a('function');
    expect(loadPerson).to.be.a('function');
    expect(watchPerson).to.be.a('function');
  })

  it("Prior to using a get/load API the IndexedDB is not openned but models with indexedDb are known", () => {
    const [getPerson, loadPerson, watchPerson] = abc(Person);
    const [getCompanies, loadCompanies] = abc(Company, { useIndexedDb: false })
    expect(AbcApi.indexedDbConnected).to.equal(false);

    expect(AbcApi.configuredModels).contains('Person');
    expect(AbcApi.configuredModels).contains('Company');
  })

  it('Connecting IndexedDB after at least one valid Model works and can call dexieTable() on instance', async () => {
    const peeps = new AbcApi(Person);
    const companies = new AbcApi(Company, { useIndexedDb: false });
    expect(AbcApi.indexedDbConnected).to.equal(false);

    await AbcApi.connectIndexedDb()
    expect(AbcApi.indexedDbConnected).to.equal(true);

    expect(peeps.dexieTable.get).to.be.a('function');

  })

  it('Connecting to IndexedDB and then trying to get table of model not included fails', async () => {
    const peeps = new AbcApi(Person);
    const companies = new AbcApi(Company, { useIndexedDb: false });

    await AbcApi.connectIndexedDb()
    expect(AbcApi.indexedDbConnected).to.equal(true);

    try {
      companies.dexieTable;
      throw new Error('companies should NOT be part of the models managed by Dexie/IndexedDB')
    } catch (e) {
      expect(e).to.be.instanceOf(Error)
      expect(e.message).to.contain('model is not being managed')
    }
  })


  it('Afer connecting to IndexedDB, can access dexieList property and gain access to the Dexie List API', async () => {
    const peeps = new AbcApi(Person);
    await AbcApi.connectIndexedDb();
    expect(peeps.dexieList).to.exist;
    expect(peeps.dexieList.all).to.be.a('function')
    expect(peeps.dexieList.since).to.be.a('function')
  })

  it('Afer connecting to IndexedDB, can access dexieRecord property and gain access to the Dexie Record API', async () => {
    const peeps = new AbcApi(Person);
    await AbcApi.connectIndexedDb();
    expect(peeps.dexieRecord).to.exist;
    expect(peeps.dexieRecord.get).to.be.a('function')
    expect(peeps.dexieRecord.update).to.be.a('function')
  })


})