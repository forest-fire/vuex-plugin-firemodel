import { AbcApi } from "../../../../private";
export async function getFromIndexedDb(dexieRecord, requestPks) {
    if (!AbcApi.indexedDbConnected) {
        await AbcApi.connectIndexedDb();
    }
    const idxRecords = [];
    const waitFor = [];
    requestPks.forEach(id => waitFor.push(dexieRecord.get(id).then(rec => {
        if (rec)
            idxRecords.push(rec);
    })));
    await Promise.all(waitFor);
    return idxRecords;
}
