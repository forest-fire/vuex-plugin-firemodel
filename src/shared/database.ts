import { DB, IFirebaseClientConfig } from "abstracted-client";
import { FireModelPluginError } from "../errors/FiremodelPluginError";

let _db: DB;
/**
 * connects to a Firebase DB unless already connected in which case it
 * it just hands back the existing connection.
 */
export async function database(config?: IFirebaseClientConfig) {
  if (config) {
    _db = await DB.connect(config);
  }

  if (!_db) {
    throw new FireModelPluginError(
      "Trying to get the database connection but it has not been established yet!",
      "not-ready"
    );
  }

  return _db;
}
