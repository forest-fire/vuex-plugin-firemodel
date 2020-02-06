# Firemodel Mutations

This directory contains the mutations which a consumer Vuex module will receive when they use this plugins built-in mutations. These mutations will automatically respond to all **Firemodel** actions/dispatches so that state in the Firebase database and the module will stay in sync.

> Note: the included mutations also supports the new ABC API which provides an alternative set of mutations for getting data from both Firebase and IndexedDB.

## Example of how to include in a Vuex module

```typescript
const productsModule: Module<IProductsState, IRootState> = {
  state,
  mutations: firemodelMutations("all"),
  getters,
  namespaced: true
};
```
