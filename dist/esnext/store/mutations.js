import { authMutations, errorMutations, localConfig, localCrud, relationships, serverConfirm, serverRollback, watcher } from "../private";
/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
export const mutations = () => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, errorMutations()), localConfig()), authMutations()), serverConfirm()), serverRollback()), localCrud()), relationships()), watcher()));
