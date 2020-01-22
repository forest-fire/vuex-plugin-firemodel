import { GetRecordsApi, IGetRecordsConfig } from "./GetRecordsApi";

/**
 * A higher order function which allows Vuex modules to configure
 * the way that module wants to have the
 */
export function getRecords(config: IGetRecordsConfig) {
  return new GetRecordsApi(config);
}
