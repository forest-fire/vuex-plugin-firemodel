import { Record } from "firemodel";
import { AbcApi } from "../AbcApi";
import get from "lodash.get";
import { getStore } from "../../../private";
/**
 * For a discrete set of primary keys, get's all knowledge of these locally. This means
 * at least Vuex but also IndexedDB if the model is configured for it.
 *
 * It returns both
 * a complete list of the primary keys found, those still missing, as well as the records
 * themselves (where Vuex representation of a record trumps the IndexedDB representation)
 */
export async function localRecords(command, requestPks, options, context) {
    const idxRecords = [];
    const store = getStore();
    const moduleIsList = context.about.config.isList;
    const data = get(store.state, context.vuex.fullPath.replace(/\//g, "."), []);
    const vuexRecords = moduleIsList ? data : [data];
    if (context.config.useIndexedDb) {
        if (!AbcApi.indexedDbConnected) {
            await AbcApi.connectIndexedDb();
        }
        const waitFor = [];
        requestPks.forEach(id => waitFor.push(context.dexieRecord.get(id).then(rec => {
            if (rec)
                idxRecords.push(rec);
        })));
        await Promise.all(waitFor);
    }
    const model = context.model.constructor;
    console.log(Array.isArray(vuexRecords), typeof vuexRecords, Object.getPrototypeOf(vuexRecords), Object.keys(vuexRecords));
    const vuexPks = vuexRecords.map(v => Record.compositeKeyRef(model, v));
    const idxPks = idxRecords.map(i => Record.compositeKeyRef(model, i));
    const localIds = Array.from(new Set([...vuexPks, ...idxPks]));
    const missingIds = requestPks
        .map(pk => typeof pk === "string" ? pk : Record.create(model, pk).compositeKeyRef)
        .filter(pk => !localIds.includes(pk));
    const modulePostfix = context.about.modelMeta.localPostfix;
    const vuexModuleName = (context.config.moduleName || moduleIsList
        ? context.about.model.plural
        : context.about.modelMeta.localModelName);
    return {
        cacheHits: localIds.length,
        cacheMisses: missingIds.length,
        foundInIndexedDb: idxPks,
        foundInVuex: vuexPks,
        foundExclusivelyInIndexedDb: idxPks.filter(i => !vuexPks.includes(i)),
        allFoundLocally: missingIds.length === 0 ? true : false,
        records: Object.assign(Object.assign({}, vuexRecords), idxRecords),
        missing: missingIds,
        apiCommand: command,
        modelConfig: context.config
    };
}
