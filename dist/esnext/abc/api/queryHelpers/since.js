/**
 * **since**
 *
 * Gets all records _since_ a certain timestamp (`epoch` with milliseconds)
 */
let since = function since(timestamp) {
    return (command, context) => {
        // if indexedDB, get from IndexedDb
        // 
        return Promise.resolve([]);
    };
};
since.prototype.isQueryHelper = true;
export { since };
