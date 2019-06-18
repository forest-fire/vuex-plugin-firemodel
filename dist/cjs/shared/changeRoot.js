"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRoot = (state, newValues) => {
    Object.keys(newValues).forEach(v => {
        state[v] = newValues[v];
    });
    const removed = Object.keys(state).filter(k => !Object.keys(newValues).includes(k));
    Object.keys(removed).forEach(k => {
        delete state[k];
    });
    return state;
};
//# sourceMappingURL=changeRoot.js.map