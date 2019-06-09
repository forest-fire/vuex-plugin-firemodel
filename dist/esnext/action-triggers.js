import { firemodelVuex } from "./index";
export default {
    /**
     * Connect to Firebase and then watch for connect/disconnection
     * events.
     */
    connect(config) {
        return async () => {
            await firemodelVuex.dispatch("@firemodel/connect", config);
        };
    },
    /**
     * Without taking username and password, logs in as a real user
     * if token is available, otherwise logs in anonymously.
     */
    passiveAuth(model) {
        return async () => {
            await firemodelVuex.dispatch("@firemodel/passiveAuth");
        };
    },
    /**
     * Watch the database for Authorization changes
     */
    watchAuth() {
        return async () => {
            await firemodelVuex.dispatch("@firemodel/watchAuth");
        };
    },
    watchRouteChange(routeLocation = "route") {
        return async () => {
            await firemodelVuex.dispatch("@firemodel/watchRouteChange");
        };
    }
};
