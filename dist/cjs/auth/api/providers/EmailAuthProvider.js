"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAuthProvider = void 0;
const private_1 = require("../../../private");
class EmailAuthProvider {
    static async credential(email, password) {
        const db = await private_1.database();
        if (!db.authProviders) {
            throw new private_1.FireModelPluginError(`Attempt to call connect() was not possible because the current DB connection -- via universal-fire -- does not have a "authProviders" API available yet.`);
        }
        return db.authProviders.EmailAuthProvider.credential(email, password);
    }
}
exports.EmailAuthProvider = EmailAuthProvider;
//# sourceMappingURL=EmailAuthProvider.js.map