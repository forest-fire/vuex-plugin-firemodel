import {
  IFmEventContext,
  IFmLifecycleEvents,
  IFmQueuedAction,
  FmConfigMutation
} from "../types/index";

/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
export async function runQueue<T>(
  ctx: IFmEventContext<T>,
  lifecycle: IFmLifecycleEvents
) {
  const remainingQueueItems: IFmQueuedAction<T>[] = [];
  const queued = ((ctx.state as any)["@firemodel"].queued as IFmQueuedAction<
    T
  >[]).filter(i => i.on === lifecycle);

  for (const item of queued) {
    try {
      const { cb } = item;
      await cb(ctx);
    } catch (e) {
      console.error(`deQueing ${item.name}: ${e.message}`);
      ctx.commit("error", {
        message: e.message,
        code: e.code || e.name,
        stack: e.stack
      });
      remainingQueueItems.push({
        ...item,
        ...{ error: e.message, errorStack: e.stack }
      });
    }
  }

  ctx.commit(FmConfigMutation.lifecycleEventCompleted, {
    event: lifecycle,
    actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name)
  });
}
