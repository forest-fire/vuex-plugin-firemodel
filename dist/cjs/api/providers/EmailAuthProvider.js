"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
class EmailAuthProvider {
    static async credential(email, password) {
        var _a;
        const db = await store_1.database();
        return (_a = db.authProviders) === null || _a === void 0 ? void 0 : _a.EmailAuthProvider.credential(email, password);
    }
}
exports.EmailAuthProvider = EmailAuthProvider;
//# sourceMappingURL=EmailAuthProvider.js.map