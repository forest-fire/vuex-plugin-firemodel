import { database } from "../../../shared/database";
import { FireModelPluginError } from "../../../errors/FiremodelPluginError";

export class EmailAuthProvider {
  static async credential(email: string, password: string) {
    const db = await database();
    if (!db.authProviders) {
      throw new FireModelPluginError(
        `Attempt to call connect() was not possible because the current DB connection -- via abstracted-client -- does not have a "authProviders" API available yet.`
      );
    }
    return db.authProviders.EmailAuthProvider.credential(email, password);
  }
}
