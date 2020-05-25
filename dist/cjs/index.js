"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("firemodel"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./auth/api"), exports);
var private_1 = require("./private");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return private_1.FiremodelPlugin; } });
Object.defineProperty(exports, "firemodelMutations", { enumerable: true, get: function () { return private_1.firemodelMutations; } });
Object.defineProperty(exports, "abc", { enumerable: true, get: function () { return private_1.abc; } });
Object.defineProperty(exports, "AbcApi", { enumerable: true, get: function () { return private_1.AbcApi; } });
//# sourceMappingURL=index.js.map