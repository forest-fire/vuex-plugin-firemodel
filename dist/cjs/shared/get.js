"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
/**
 * Gets a value in a deeply nested object. This is a replacement to `lodash.get`
 *
 * @param obj the base object to get the value from
 * @param dotPath the path to the object, using "." as a delimiter
 * @param defaultValue optionally you may state a default value if the operation results in `undefined`
 */
function get(obj, dotPath, defaultValue) {
    const parts = dotPath.split(".");
    let value = obj;
    parts.forEach((p) => {
        value =
            typeof value === "object" && Object.keys(value).includes(p)
                ? value[p]
                : undefined;
    });
    return value ? value : defaultValue;
}
exports.get = get;
//# sourceMappingURL=get.js.map