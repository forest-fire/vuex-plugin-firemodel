import { FireModel, Record, List, Watch } from "firemodel";
import { DB } from "abstracted-client";
import { createError } from "common-types";
import { setDb, configuration } from "..";
/**
 * **actionsConfig**
 *
 * This plugin has two actions which it services: **config** and **crud**.
 * This defines the _config_ actions only. The configuration actions are
 * sort of what they say on the tin ... things which involve configuring
 * this plug.
 */
export const actionsConfig = {
    /**
     * **connect**
     *
     * Connects to the Firebase database
     */
    async connect(store, config) {
        const { commit, dispatch, rootState } = store;
        commit("@firemodel/CONFIGURE" /* configure */, config); // set Firebase configuration
        try {
            const db = await DB.connect(config);
            setDb(db);
            FireModel.defaultDb = db;
            commit("@firemodel/CONNECT" /* connect */);
            const ctx = {
                Record,
                List,
                Watch,
                db,
                dispatch,
                commit,
                state: rootState
            };
            await deQueue(ctx, "connected");
        }
        catch (e) {
            commit("@firemodel/CONNECTION_ERROR" /* connectionError */, e);
            throw createError(`firemodel-plugin/connection-error`, e.message);
        }
    },
    /**
     * **anonymousAuth**
     *
     * checks to see if already signed in to Firebase but if not
     * then signs into Firebase as an _anonymous_ user
     */
    async anonymousAuth(store) {
        const { commit, state, dispatch, rootState } = store;
        const db = await DB.connect(state.config);
        const auth = await db.auth();
        let user;
        if (auth.currentUser) {
            user = {
                isAnonymous: auth.currentUser.isAnonymous,
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                emailVerified: auth.currentUser.emailVerified
            };
        }
        else {
            const anon = await auth.signInAnonymously();
            user = {
                uid: anon.user.uid,
                isAnonymous: true,
                emailVerified: false
            };
        }
        commit("setCurrentUser", user);
        const ctx = Object.assign({ Watch,
            Record,
            List,
            db,
            dispatch,
            commit }, user, { state: rootState });
        await deQueue(ctx, "logged-in");
    },
    /**
     * **watchAuth**
     *
     * Watches Firebase auth events and sends notifications of changes
     * via `LOGGED_IN` and `LOGGED_OUT` mutations which in turn ensure
     * that the `@firemodel` state tree has an up-to-date representation
     * of the `currentUser`.
     *
     * Also enables the appropriate lifecycle hooks: `onLogOut` and `onLogIn`
     */
    async watchAuth(store) {
        const { commit, rootState, dispatch, state } = store;
        const baseContext = {
            List,
            Record,
            Watch,
            commit,
            dispatch,
            state: rootState
        };
        const authChanged = (user) => {
            if (user) {
                const fm = state["@firemodel"];
                if (state.currentUser && fm.currentUser.uid !== user.uid) {
                    if (state.currentUser)
                        commit("userChanged", { old: state.currentUser, new: user });
                    // deQueue(store, 'user-changed')
                }
                else if (!state.currentUser) {
                    commit("@firemodel/USER_LOGGED_IN" /* userLoggedIn */, user);
                    deQueue(Object.assign({}, baseContext, { uid: user.uid, isAnonymous: user.isAnonymous }), "logged-in");
                }
                commit("@firemodel/SET_CURRENT_USER" /* setCurrentUser */, {
                    isAnonymous: user.isAnonymous,
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified
                });
            }
            else {
                commit("@firemodel/USER_LOGGED_OUT" /* userLoggedOut */);
                deQueue(Object.assign({}, baseContext, { uid: state.currentUser.uid, isAnonymous: state.currentUser.isAnonymous }), "logged-out");
            }
        };
    },
    /**
     * **watchRouteChanges**
     *
     * Enables lifecycle hooks for route changes
     */
    async watchRouteChanges({ dispatch, commit, rootState }) {
        if (configuration.onRouteChange) {
            const ctx = {
                Watch,
                Record,
                List,
                dispatch,
                commit,
                state: rootState
            };
            deQueue(ctx, "route-changed");
        }
    }
};
/**
 * **deQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
async function deQueue(ctx, lifecycle) {
    const remainingQueueItems = [];
    const queued = ctx.state["@firemodel"].queued.filter(i => i.on === lifecycle);
    for (const item of queued) {
        try {
            const { cb } = item;
            await cb(ctx);
        }
        catch (e) {
            console.error(`deQueing ${item.name}: ${e.message}`);
            ctx.commit("error", {
                message: e.message,
                code: e.code || e.name,
                stack: e.stack
            });
            remainingQueueItems.push(Object.assign({}, item, { error: e.message, errorStack: e.stack }));
        }
    }
    ctx.commit("@firemodel/LIFECYCLE_EVENT_COMPLETED" /* lifecycleEventCompleted */, {
        event: lifecycle,
        actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name)
    });
}
