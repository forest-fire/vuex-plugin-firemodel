import { Record, Watch, FireModel } from "firemodel";
import { addNamespace } from "../addNamespace";
function stripPrefix(name) {
    return name.replace("@firemodel/", "");
}
export const actionsCrud = {
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
                    commit(addNamespace("@firemodel/QUEUE_WATCHER" /* queueWatcher */), {
                        name: `watch-record-${id}`,
                        cb,
                        on: params.on
                    });
                }
                return;
            case "logged-in":
                return;
            default:
                commit(addNamespace("APP_ERROR" /* appErr */), {
                    message: `the specified "on" event of "${params.on}" was not recognized`
                });
        }
    }
};
