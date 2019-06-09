import { FMEvents, Record, Watch, FireModel, pathJoin } from "firemodel";
import get from "lodash.get";
import { generateLocalId } from "./store/vuexModule";
function stripPrefix(name) {
    return name.replace("@firemodel/", "");
}
export const actionsCrud = {
    /**
     * The record has changed in an unstated way; this
     * type of event should typically come from a "value"
     * based event watcher on a record.
     */
    [stripPrefix(FMEvents.RECORD_CHANGED)](store, payload) {
        if (payload.watcherSource === "record" && !payload.dbPath) {
            payload.dbPath = payload.query._path;
        }
        if (payload.watcherSource === "record") {
            const localPath = payload.localPath || payload.modelName;
            if (store.state.localOnly.map(i => i.dbPath).includes(payload.dbPath)) {
                const change = store.state.localOnly.find(i => i.dbPath === payload.dbPath);
                if (change) {
                    payload.priorValue = change.priorValue;
                }
                store.commit("SERVER_CHANGE_CONFIRMATION", payload);
            }
            store.commit(pathJoin(localPath, "CHANGED"), payload, { root: true });
        }
    },
    [stripPrefix(FMEvents.RECORD_CHANGED_LOCALLY)]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign({}, payload, { priorValue: get(rootState, payload.localPath) });
        commit("CHANGED_LOCALLY", payloadPlus);
        commit(`${payload.localPath}/CHANGED_LOCALLY`, payloadPlus, { root: true });
    },
    [stripPrefix(FMEvents.RECORD_ADDED_LOCALLY)]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign({}, payload, { priorValue: get(rootState, payload.localPath) });
        commit("ADDED_LOCALLY", payloadPlus);
        if (payload.watcherSource === "record") {
            commit(`${payload.localPath}/CHANGED`, payloadPlus, { root: true });
        }
        else {
            commit(`${payload.localPath.replace(`/${payload.localPostfix}`, "")}/ADD`, payloadPlus, { root: true });
        }
    },
    [stripPrefix(FMEvents.RECORD_ADDED_CONFIRMATION)]({ commit, state }, payload) {
        if (state.localOnly.find(i => i.dbPath == payload.dbPath)) {
            commit("SERVER_ADD_CONFIRMATION", payload);
        }
    },
    [stripPrefix(FMEvents.RECORD_ADDED)]({ commit, rootState, state }, payload) {
        const changeId = generateLocalId(payload.compositeKey, "add");
        // if (state.localOnly.find(i => i.dbPath == payload.dbPath)) {
        //   commit('SERVER_CONFIRMATION', payload)
        // }
        // Get the Vuex State Node
        const pathToStateNode = payload.localPath.replace(`/${payload.localPostfix}`, "");
        // Depending on whether LIST or RECORD, get local path
        const pathToRoot = pathJoin(pathToStateNode, payload.key);
        commit(`${payload.localPath.replace(`/${payload.localPostfix}`, "")}/ADD`, payload, {
            root: true
        });
    },
    [stripPrefix(FMEvents.RECORD_REMOVED)](store, payload) {
        console.log("TBD record removed: ", payload);
    },
    [stripPrefix(FMEvents.WATCHER_STARTED)]({ commit }, payload) {
        commit("WATCHER_STARTED", payload);
    },
    async watchRecord({ commit }, params) {
        if (!params.on) {
            params.on = "connected";
        }
        const { id, model, options } = params;
        const rec = Record.create(model);
        rec.id = id;
        const dbPath = rec.dbPath;
        const localPath = rec.localPath;
        const cb = async () => {
            Watch.record(model, id, options || {}).start();
        };
        switch (params.on) {
            case "connected":
                if (FireModel.defaultDb) {
                    await FireModel.defaultDb.waitForConnection();
                    console.log("ready");
                    await cb();
                }
                else {
                    console.log("deferred");
                    commit("queue", { name: `watch-record-${id}`, cb, on: params.on });
                }
                return;
            case "logged-in":
                return;
            default:
                commit("error", {
                    message: `the specified "on" event of "${params.on}" was not recognized`
                });
        }
    }
};
