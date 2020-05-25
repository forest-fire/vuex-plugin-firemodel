let _store;
export function preserveStore(store) {
    _store = store;
}
export function getStore() {
    return _store;
}
