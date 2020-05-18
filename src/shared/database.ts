import { DB, RealTimeClient } from "universal-fire";
import { FireModel } from "firemodel";
import { IClientConfig, IMockConfig } from "@forest-fire/types";
import { FireModelPluginError } from "../private";

let _db: RealTimeClient;
let _config: IClientConfig | IMockConfig;
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
export async function database(config?: IClientConfig | IMockConfig) {
  if (!_db) {
    _db = await DB.connect(RealTimeClient, config);
    FireModel.defaultDb = _db;
  }

  if (!_db) {
    throw new FireModelPluginError(
      "Trying to get the database connection but it has not been established yet!",
      "not-ready"
    );
  }

  return _db;
}
