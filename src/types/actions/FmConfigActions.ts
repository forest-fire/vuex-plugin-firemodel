import { Store } from "vuex";
import { IFirebaseConfig } from "abstracted-firebase/dist/esnext/types";

export const enum FmConfigAction {
  connect = "connect",
  watchAuth = "watchAuth",
  anonymousAuth = "anonymousAuth",
  watchRouteChanges = "watchRouteChanges"
}
