import { Record } from "firemodel";
export async function queryIndexedDb(ctx, dexieQuery, vuexPks) {
    // Populate Vuex with what IndexedDB knows
    const idxRecords = await dexieQuery().catch(e => {
        throw e;
    });
    const indexedDbPks = idxRecords.map(i => Record.compositeKeyRef(ctx.model.constructor, i));
    const local = {
        records: idxRecords,
        vuexPks,
        indexedDbPks,
        localPks: Array.from(new Set(vuexPks.concat(...indexedDbPks)))
    };
    return local;
}
