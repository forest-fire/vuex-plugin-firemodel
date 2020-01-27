import { AbcApi } from "../AbcApi";
import { IDictionary } from "common-types";
import { Model } from "firemodel";
import { AbcError } from "../../../errors";
import { AbcRequestCommand, IAbcOptions } from "../../../types";

/**
 * **refresh**
 * 
 * Gets **all** records from IndexedDB and then queries Firebase for records
 * since the passed in `timestamp`. 
 * 
 * If no timestamp is passed in than it will use a browser cookie that this plugin
 * maintains to indicate the last request to the DB.
 */
let refresh = function refresh<T extends Model = IDictionary>(timestamp: number) {
  return <T>(command: AbcRequestCommand, options: IAbcOptions<T>, context: AbcApi<T>): Promise<T[]> => {
    // if indexedDB, get all from IndexedDb and load into Vuex
    // if NOT then error (as the utility is not there)
    if(context.config.useIndexedDb) {

      

    } else {
      throw new AbcError(`You have tried to ${command} the ${context.about.model.pascal} model with the "refresh" query helper but this has no real utility because this model has been configured to NOT use IndexedDB.`, `not-allowed`);
    }

    // save results to Vuex

    // request from Firebase

    return [];
  }

}

refresh.prototype.isQueryHelper = true;

export { refresh }
