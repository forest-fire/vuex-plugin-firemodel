import { IAbcApiConfig } from "../../private";
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
export declare function configApi(config: Omit<IAbcApiConfig<any>, 'model'>): Pick<IAbcApiConfig<any>, "isList" | "useIndexedDb" | "encrypt" | "db" | "moduleName">;
/** the _default_ configuration for **ABC** API surfaces */
export declare function getDefaultApiConfig(): Pick<IAbcApiConfig<any>, "isList" | "useIndexedDb" | "encrypt" | "db" | "moduleName">;
