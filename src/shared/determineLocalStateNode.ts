import { pathJoin } from "common-types";

import { IFmRecordEvent } from "firemodel";

/**
 * **pathToState**
 *
 * Takes a **Firemodel** server event and determines the
 * appropriate path to the local state node.
 */
export function determineLocalStateNode(payload: IFmRecordEvent, mutation: string) {
  return pathJoin(payload.localPath.replace(`/${payload.localPostfix}`, ""), mutation);
}
