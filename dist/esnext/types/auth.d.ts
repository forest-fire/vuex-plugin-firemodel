export declare enum AuthPersistenceStrategy {
    /**
     * Indicates that the state will be persisted even when the browser window is closed
     * or the activity is destroyed in React Native. An explicit sign out is needed to
     * clear that state. Note that Firebase Auth web sessions are single host origin
     * and will be persisted for a single domain only.
     */
    local = "local",
    /**
     * Indicates that the state will only persist in the current session or tab, and will
     * be cleared when the tab or window in which the user authenticated is closed. Applies
     * only to web apps.
     */
    session = "session",
    /**
     * Indicates that the state will only be stored in memory and will be cleared when the
     * window or activity is refreshed.
     */
    none = "none"
}
export declare type IAuthPersistenceStrategy = keyof typeof AuthPersistenceStrategy;
