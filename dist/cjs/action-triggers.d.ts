import { IFmModelConstructor } from "./types";
declare const _default: {
    /**
     * Connect to Firebase and then watch for connect/disconnection
     * events.
     */
    connect(config: import("abstracted-firebase/dist/esnext/types").IFirebaseConfig): () => Promise<void>;
    /**
     * Without taking username and password, logs in as a real user
     * if token is available, otherwise logs in anonymously.
     */
    passiveAuth(model?: IFmModelConstructor<import("firemodel").Model>): () => Promise<void>;
    /**
     * Watch the database for Authorization changes
     */
    watchAuth(): () => Promise<void>;
    watchRouteChange(routeLocation?: string): () => Promise<void>;
};
export default _default;
