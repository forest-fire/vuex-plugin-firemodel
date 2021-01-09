import { FmCallback, IFiremodelConfig, IFmQueuedAction } from '@/types';
import { FireModelPluginError } from '@/errors';
import { Store } from 'vuex';
import { addNamespace } from '@/util';
import { FmConfigMutation } from '@/enums';

export async function queueLifecycleEvents<T>(store: Store<T>, config?: IFiremodelConfig<T>) {
  if (!config) {
    throw new FireModelPluginError(
      `There was no configuration sent into the FiremodelPlugin!`,
      'not-allowed'
    );
    return;
  }
  const iterable = [
    ['onConnect', 'connected'],
    ['onAuth', 'auth-event'],
    ['onLogin', 'logged-in'],
    ['onLogout', 'logged-out'],
    ['onDisconnect', 'disconnected'],
    ['onRouteChange', 'route-changed'],
    ['onUserUpgraded', 'user-upgraded'],
  ];

  for (const i of iterable) {
    const [name, event] = i;
    if (config[name as keyof IFiremodelConfig<T>]) {
      const cb: FmCallback = config[name as keyof IFiremodelConfig<T>] as any;
      store.commit(addNamespace(FmConfigMutation.queueHook), {
        on: event,
        name: `lifecycle-event-${event}`,
        cb,
      } as IFmQueuedAction<T>);
    }
  }
}
