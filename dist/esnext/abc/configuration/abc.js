import { AbcApi } from "../api/AbcApi";
/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
export function abc(model, config = {}) {
    const api = new AbcApi(model, config);
    return [api.get.bind(api), api.load.bind(api), api.watch.bind(api)];
}
