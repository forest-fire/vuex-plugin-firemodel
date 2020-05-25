"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginConfig = exports.storePluginConfig = void 0;
let _pluginConfig;
function storePluginConfig(config) {
    _pluginConfig = config;
}
exports.storePluginConfig = storePluginConfig;
function getPluginConfig() {
    return _pluginConfig;
}
exports.getPluginConfig = getPluginConfig;
//# sourceMappingURL=plugin-config.js.map