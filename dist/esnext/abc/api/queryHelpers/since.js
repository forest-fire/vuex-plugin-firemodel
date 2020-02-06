/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since(defn) {
    return function all(defn) {
        return async (command, ctx) => { };
    };
};
since.prototype.isQueryHelper = true;
export { since };
