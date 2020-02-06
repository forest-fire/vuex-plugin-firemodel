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
export function configApi(config) {
    defaultConfig = Object.assign(Object.assign({}, defaultConfig), config);
    return defaultConfig;
}
/** the _default_ configuration for **ABC** API surfaces */
export function getDefaultApiConfig() {
    return defaultConfig;
}
