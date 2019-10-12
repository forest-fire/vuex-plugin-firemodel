import { pathJoin } from "common-types";
/**
 * **pathToState**
 *
 * Takes a **Firemodel** server event and determines the
 * appropriate path to the local state node.
 */
export function determineLocalStateNode(payload, mutation) {
    return pathJoin((payload.localPath || "").replace(`/${payload.localPostfix}`, ""), mutation);
}
