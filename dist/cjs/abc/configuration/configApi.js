"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let defaultConfig = {
    useIndexedDb: true,
    isList: true,
    encrypt: false,
};
/**
 * Allows consumers of this plugin to state the _default_ state of
 * their model's configuration. The normal defaults are:
```typescript
{
  useIndexedDb: true,
  plural: true,
  encrypt: false,
}
```
 */
function configApi(config) {
    defaultConfig = Object.assign(Object.assign({}, defaultConfig), config);
    return defaultConfig;
}
exports.configApi = configApi;
/** the _default_ configuration for **ABC** API surfaces */
function getDefaultApiConfig() {
    return defaultConfig;
}
exports.getDefaultApiConfig = getDefaultApiConfig;
//# sourceMappingURL=configApi.js.map