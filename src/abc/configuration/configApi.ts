import { IAbcApiConfig } from "@/types";

let defaultConfig: Omit<IAbcApiConfig<any>, "model"> = {
  useIndexedDb: true,
  isList: true,
  encrypt: false
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
export function configApi(config: Omit<IAbcApiConfig<any>, "model">) {
  defaultConfig = { ...defaultConfig, ...config };
  return defaultConfig;
}

/** the _default_ configuration for **ABC** API surfaces */
export function getDefaultApiConfig() {
  return defaultConfig;
}
