"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firemodel_1 = require("firemodel");
const lodash_set_1 = __importDefault(require("lodash.set"));
const changeRoot = (state, newValues) => {
    Object.keys(newValues).forEach(v => {
        state[v] = newValues[v];
    });
    const removed = Object.keys(state).filter(k => !Object.keys(newValues).includes(k));
    Object.keys(removed).forEach(k => {
        delete state[k];
    });
    return state;
};
function recordMutations() {
    return {
        ADD(state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                const value = payload.paths.reduce((prev, curr) => {
                    const path = firemodel_1.pathJoin(payload.localPath, curr.path);
                    lodash_set_1.default(prev, path, curr.value);
                    return prev;
                }, {});
            }
        },
        CHANGED_LOCALLY(state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                //@TODO
            }
        },
        CHANGED(state, payload) {
            if (payload.value) {
                state = changeRoot(state, payload.value);
            }
            else if (payload.paths) {
                //@TODO
            }
        },
        REMOVED(state, payload) {
            //
        },
        RELATIONSHIP_ADDED(state, payload) {
            //
        },
        RELATIONSHIP_REMOVED(state, payload) {
            //
        },
    };
}
exports.recordMutations = recordMutations;
//# sourceMappingURL=mutations-record.js.map