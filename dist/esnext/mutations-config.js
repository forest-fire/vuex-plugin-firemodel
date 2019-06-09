const mutations = {
    configure: (state, config) => {
        state.config = config;
    },
    connected(state) {
        state.status = 'connected';
    },
    connecting(state) {
        state.status = 'connecting';
    },
    connectionError(state, err) {
        state.status = 'error';
        state.errors = state.errors ? state.errors.concat(err.message) : [err.message];
    },
    error(state, err) {
        if (!state.errors) {
            state.errors = [];
        }
        state.errors.push(err.message);
    },
    clearErrors(state) {
        state.errors = [];
    },
    pluginSetupComplete() { },
    setCurrentUser(state, user) {
        state.currentUser = {
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            email: user.email,
            emailVerified: user.emailVerified,
        };
        state.authenticated = !user ? false : user.isAnonymous ? 'anonymous' : 'logged-in';
    },
    userLoggedOut(state) {
        state.currentUser = undefined;
        state.authenticated = false;
    },
    queue(state, item) {
        state.queued = state.queued.concat(item);
    },
    lifecycleEvent(state, event) {
        //
    },
    ADDED_LOCALLY(state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: 'add',
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            priorValue: p.priorValue,
            timestamp: new Date().getTime(),
        });
    },
    CHANGED_LOCALLY(state, payload) {
        const p = payload;
        state.localOnly = state.localOnly.concat({
            action: 'update',
            dbPath: p.dbPath,
            localPath: p.localPath,
            value: p.value,
            priorValue: p.priorValue,
            timestamp: new Date().getTime(),
        });
    },
    SERVER_ADD_CONFIRMATION(state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    },
    SERVER_CHANGE_CONFIRMATION(state, payload) {
        state.localOnly = state.localOnly.filter(i => i.dbPath !== payload.dbPath);
    },
    WATCHER_STARTED(state, payload) {
        state.watching = state.watching.concat(payload);
    },
};
export function generateLocalId(compositeKey, action) {
    // return createCompositeKeyString(compositeKey) + '-' + action
    return action;
}
const mutationTypes = Object.keys(mutations).filter(i => typeof i !== 'function');
export default mutations;
