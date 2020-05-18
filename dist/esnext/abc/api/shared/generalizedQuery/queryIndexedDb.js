import { Record } from "firemodel";
export async function queryIndexedDb(modelConstructor, dexieQuery) {
    // Populate Vuex with what IndexedDB knows
    const idxRecords = await dexieQuery().catch(e => {
        throw e;
    });
    const indexedDbPks = idxRecords.map(i => Record.compositeKeyRef(modelConstructor, i));
    const local = {
        records: idxRecords,
        indexedDbPks,
        localPks: []
    };
    return local;
}
