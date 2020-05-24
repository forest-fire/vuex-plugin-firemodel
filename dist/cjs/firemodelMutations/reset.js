"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = void 0;
const vue_1 = __importDefault(require("vue"));
const private_1 = require("../private");
function reset(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        ["RESET" /* reset */](state, mod) {
            if (offset && Array.isArray(state[offset])) {
                vue_1.default.set(state, offset, []);
            }
            else {
                // TODO: make this reset to "default state" not empty state
                return Object.keys(state).forEach(p => vue_1.default.set(state, p, private_1.getInitialState()[mod][p]));
            }
        }
    };
}
exports.reset = reset;
//# sourceMappingURL=reset.js.map