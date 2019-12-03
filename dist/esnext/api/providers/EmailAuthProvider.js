import { database } from "../../store";
export class EmailAuthProvider {
    static async credential(email, password) {
        var _a;
        const db = await database();
        return (_a = db.authProviders) === null || _a === void 0 ? void 0 : _a.EmailAuthProvider.credential(email, password);
    }
}
