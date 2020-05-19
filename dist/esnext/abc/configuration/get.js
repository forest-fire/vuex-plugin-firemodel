import { AbcApi } from "../../private";
/**
 * Constructs a `AbcApi` object instance for the given `Model`
 */
export function get(model, config = {}) {
    const api = new AbcApi(model, config);
    return api.get;
}
