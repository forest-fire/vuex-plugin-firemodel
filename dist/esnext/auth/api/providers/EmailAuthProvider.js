import { FireModelPluginError, getDatabase } from "../../../private";
export class EmailAuthProvider {
    static async credential(email, password) {
        const db = await getDatabase();
        if (!db.authProviders) {
            throw new FireModelPluginError(`Attempt to call connect() was not possible because the current DB connection -- via universal-fire -- does not have a "authProviders" API available yet.`);
        }
        return db.authProviders.EmailAuthProvider.credential(email, password);
    }
}
