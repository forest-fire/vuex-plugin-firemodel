import { IFmWatchEvent } from "firemodel";
import { pathJoin } from "native-dash";

/**
 * **pathToState**
 *
 * Takes a **Firemodel** server event and determines the
 * appropriate path to the local state node.
 */
export function determineLocalStateNode(
  payload: IFmWatchEvent,
  mutation: string
) {
  return pathJoin(
    (payload.localPath || "").replace(`/${payload.localPostfix}`, ""),
    mutation
  );
}
