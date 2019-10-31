"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
function reset(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        reset(state, payload) {
            if (offset && Array.isArray(state[offset])) {
                vue_1.default.set(state, offset, []);
            }
            else {
                state = {};
            }
        }
    };
}
exports.reset = reset;
//# sourceMappingURL=reset.js.map