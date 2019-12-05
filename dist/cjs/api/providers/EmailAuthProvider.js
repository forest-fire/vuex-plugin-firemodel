"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../shared/database");
const FiremodelPluginError_1 = require("../../errors/FiremodelPluginError");
class EmailAuthProvider {
    static async credential(email, password) {
        const db = await database_1.database();
        if (!db.authProviders) {
            throw new FiremodelPluginError_1.FireModelPluginError(`Attempt to call connect() was not possible because the current DB connection -- via abstracted-client -- does not have a "authProviders" API available yet.`);
        }
        return db.authProviders.EmailAuthProvider.credential(email, password);
    }
}
exports.EmailAuthProvider = EmailAuthProvider;
//# sourceMappingURL=EmailAuthProvider.js.map