import { Store } from "vuex";

let _store: Store<any>;

export function preserveStore<T = any>(store: Store<T>) {
  _store = store;
}

export function getStore() {
  return _store;
}
