"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuth = exports.getAuth = void 0;
const database_1 = require("./database");
let _auth;
async function getAuth() {
    if (!_auth) {
        _auth = await database_1.getDatabase().auth();
    }
    return _auth;
}
exports.getAuth = getAuth;
function setAuth(auth) {
    _auth = auth;
}
exports.setAuth = setAuth;
//# sourceMappingURL=auth.js.map