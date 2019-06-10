import { ActionTree, Action } from "vuex";
import { Record, Watch, FireModel } from "firemodel";
import { IGenericStateTree } from "../index";
import { IFiremodelState, IFmActionWatchRecord } from "../types";
import { FmConfigMutation } from "../types/mutations/FmConfigMutation";
import { addNamespace } from "../addNamespace";

function stripPrefix(name: string) {
  return name.replace("@firemodel/", "");
}

export const actionsCrud: ActionTree<IFiremodelState, IGenericStateTree> = {
  async watchRecord({ commit }, params: IFmActionWatchRecord) {
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
        } else {
          commit(addNamespace(FmConfigMutation.queueWatcher), {
            name: `watch-record-${id}`,
            cb,
            on: params.on
          });
        }
        return;
      case "logged-in":
        return;

      default:
        commit(addNamespace(FmConfigMutation.appErr), {
          message: `the specified "on" event of "${params.on}" was not recognized`
        });
    }
  }
};
