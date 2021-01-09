import type { IFiremodelConfig } from '@/types';

import { Store } from 'vuex';
import { addNamespace } from '@/util';
import { getDatabase } from '@/util/state-mgmt';
import { FmConfigAction, FmConfigMutation } from './enums';

/**
 * Based on the configuration passed in by the consuming app, core
 * services will be started by firing off the appropriate Vuex _action_.
 */
export async function coreServices<T>(store: Store<T>, config?: IFiremodelConfig<T>) {
  const db = getDatabase();
  const starting: Promise<any>[] = [];
  // CONNECT
  if (config?.connect) {
    if (!db.isConnected) {
      await db.connect();
    }

    // run connect action
    starting.push(store.dispatch(addNamespace(FmConfigAction.connect), getDatabase()));
  }

  // AUTH
  if (config?.auth) {
    // run auth action
    starting.push(store.dispatch(addNamespace(FmConfigAction.firebaseAuth), config));
  }

  if (config?.routeChanges) {
    // run routeChanges action
    starting.push(store.dispatch(addNamespace(FmConfigAction.watchRouteChanges)));
  }
  await Promise.all(starting);

  store.commit(addNamespace(FmConfigMutation.coreServicesStarted), {
    message: `all core firemodel plugin services started`,
    config: db.config,
  });
}
