/**
 * **serverConfirms**
 *
 * When the client originates an event, it first triggers `local` mutations
 * as the first part of the "two phased commit", then when this action is
 * validated by the Firebase DB it sends a confirm message.
 *
 * The goal of this plugin for _rollbacks_ is to immediately change the state
 * back to what it had been before it had been optimistically set by the `local`
 * mutation.
 */
export function serverRollbacks(propOffset) {
    return {
        ["ROLLBACK_ADD" /* serverAddRollback */](state, payload) {
            state = propOffset
                ? Object.assign({}, state, { [propOffset]: payload.value }) : payload.value;
        },
        ["ROLLBACK_CHANGE" /* serverChangeRollback */](state, payload) {
            state = propOffset
                ? Object.assign({}, state, { [propOffset]: payload.value }) : payload.value;
        },
        ["ROLLBACK_REMOVE" /* serverRemoveRollback */](state, payload) {
            state = propOffset
                ? Object.assign({}, state, { [propOffset]: payload.value }) : payload.value;
        }
    };
}
