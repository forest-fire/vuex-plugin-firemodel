import { AbcApi } from "../api/AbcApi";
/**
 * Returns an array of **AbcApi** API's: `get`, `load`, and `watch`
 */
export function abc(model, config = {}) {
    const api = new AbcApi(model, config);
    return [api.get.bind(api), api.load.bind(api), api.watch.bind(api)];
}
