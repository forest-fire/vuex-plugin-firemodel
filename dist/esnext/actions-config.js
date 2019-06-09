import { FireModel, Record, List, Watch } from 'firemodel';
import { DB } from 'abstracted-client';
import { createError } from 'common-types';
import { configuration, setDb } from './firemodel';
/**
 * The actions which help to configure and setup
 * the Firemodel Plugin
 */
export default {
    async connect(store, config) {
        const { commit, dispatch, rootState } = store;
        commit('configure', config); // set Firebase configuration
        commit('connecting');
        try {
            const db = await DB.connect(config);
            setDb(db);
            FireModel.defaultDb = db;
            commit('connected');
            const ctx = {
                Record,
                List,
                Watch,
                db,
                dispatch,
                commit,
                state: rootState,
            };
            await deQueue(ctx, 'connected');
        }
        catch (e) {
            commit('connectionError', e);
            throw createError(`@firemodel/connection-error`, e.message);
        }
    },
    async passiveAuth(store) {
        const { commit, state, dispatch, rootState } = store;
        const db = await DB.connect(state.config);
        const auth = await db.auth();
        let user;
        if (auth.currentUser) {
            user = {
                isAnonymous: auth.currentUser.isAnonymous,
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                emailVerified: auth.currentUser.emailVerified,
            };
        }
        else {
            const anon = await auth.signInAnonymously();
            user = {
                uid: anon.user.uid,
                isAnonymous: true,
                emailVerified: false,
            };
        }
        commit('setCurrentUser', user);
        const ctx = Object.assign({ Watch,
            Record,
            List,
            db,
            dispatch,
            commit }, user, { state: rootState });
        await deQueue(ctx, 'logged-in');
    },
    async watchAuth(store) {
        const { commit, rootState, dispatch, state } = store;
        const baseContext = {
            List,
            Record,
            Watch,
            commit,
            dispatch,
            state: rootState,
        };
        const authChanged = (user) => {
            if (user) {
                const fm = state['@firemodel'];
                if (state.currentUser && fm.currentUser.uid !== user.uid) {
                    if (state.currentUser)
                        commit('userChanged', { old: state.currentUser, new: user });
                    // deQueue(store, 'user-changed')
                }
                else if (!state.currentUser) {
                    commit("@firemodel/USER_LOGGED_IN" /* userLoggedIn */, user);
                    deQueue(Object.assign({}, baseContext, { uid: user.uid, isAnonymous: user.isAnonymous }), 'logged-in');
                }
                commit("@firemodel/SET_CURRENT_USER" /* setCurrentUser */, {
                    isAnonymous: user.isAnonymous,
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                });
            }
            else {
                commit("@firemodel/USER_LOGGED_OUT" /* userLoggedOut */);
                deQueue(Object.assign({}, baseContext, { uid: state.currentUser.uid, isAnonymous: state.currentUser.isAnonymous }), 'logged-out');
            }
        };
    },
    async watchRouteChanges({ dispatch, commit, rootState }) {
        if (configuration.onRouteChange) {
            const ctx = {
                Watch,
                Record,
                List,
                dispatch,
                commit,
                state: rootState,
            };
            deQueue(ctx, 'route-changed');
        }
    },
};
/**
 * deQueue
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
async function deQueue(ctx, lifecycle) {
    const remainingQueueItems = [];
    const queued = ctx.state['@firemodel'].queued.filter(i => i.on === lifecycle);
    for (const item of queued) {
        try {
            const { cb } = item;
            await cb(ctx);
        }
        catch (e) {
            console.error(`deQueing ${item.name}: ${e.message}`);
            ctx.commit('error', {
                message: e.message,
                code: e.code || e.name,
                stack: e.stack,
            });
            remainingQueueItems.push(Object.assign({}, item, { error: e.message, errorStack: e.stack }));
        }
    }
    ctx.commit("@firemodel/LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */, {
        event: lifecycle,
        actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name),
    });
}
