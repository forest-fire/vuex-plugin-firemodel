"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isRecord_1 = require("../shared/isRecord");
const changeRoot_1 = require("../shared/changeRoot");
const updateList_1 = require("../shared/updateList");
function reset(propOffset) {
    const offset = !propOffset ? "all" : propOffset;
    return {
        reset(state, payload) {
            if (isRecord_1.isRecord(state, payload)) {
                changeRoot_1.changeRoot(state, null);
            }
            else {
                updateList_1.updateList(state, offset, []);
            }
        }
    };
}
exports.reset = reset;
//# sourceMappingURL=reset.js.map