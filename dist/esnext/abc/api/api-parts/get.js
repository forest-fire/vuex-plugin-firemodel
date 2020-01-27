import { AbcApi } from "../AbcApi";
import { getStore } from "../../../index";
import get from "lodash.get";
/**
 * Retrieves records from:
 *
 * - **IndexedDB** (if configured to use)
 * - and then **Firebase**
 *      → always with a `load` command
 *      → with a `get` command it will if the _getStrategy_ is "refreshAlways" or "refreshWhenMissing"
 *
 * Results are always put into Vuex as soon as they are available.
 */
export async function retrieveKeys(command, ids, options, context) {
    const records = [];
    const store = getStore();
    const localState = get(store.state, `${context.about.modelMeta.localPrefix}`);
    if (!AbcApi.indexedDbConnected) {
        await AbcApi.connectIndexedDb();
    }
    if (context.config.useIndexedDb) {
        const waitFor = [];
        ids.forEach(id => waitFor.push(context.dexieRecord.get(id).then(rec => records.push(rec))));
        await Promise.all(waitFor);
    }
    return [];
}
