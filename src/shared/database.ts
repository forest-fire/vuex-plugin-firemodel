import { DB, RealTimeClient } from "universal-fire";
import { IClientConfig, IMockConfig } from "@forest-fire/types";
import { FireModelPluginError } from "../errors/FiremodelPluginError";
import { FireModel } from "firemodel";

let _db: DB;
let _config: IClientConfig | IMockConfig;
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
export async function database(config?: IClientConfig | IMockConfig) {
  if (config) {
    if (JSON.stringify(config) !== JSON.stringify(_config) || !_db) {
      _config = config;
      _db = await DB.connect(RealTimeClient, config);
    }
    FireModel.defaultDb = _db;
  }

  if (!_db && !_config) {
    throw new FireModelPluginError(
      "Trying to get the database connection but it has not been established yet!",
      "not-ready"
    );
  }

  return _db;
}
