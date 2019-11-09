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

  let errors = 0;
  let successes = 0;

  for (const item of queued) {
    try {
      await item.cb(ctx);
      successes++;
    } catch (e) {
      errors++;
      console.error(
        `deQueing ${item.name}: ${
          e.message
        }.\n\nThe callback which being called when the error occurred was: ${
          item.cb ? item.cb.toString() : "undefined callback"
        }`
      );
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
  if (errors > 0) {
    console.warn(
      `- while running the ${lifecycle} event, ${errors} errors were encountered [ ${successes} successful ]; errors will be listed in the @firemodel state tree.`
    );
  }

  ctx.commit(FmConfigMutation.lifecycleEventCompleted, {
    event: lifecycle,
    actionCallbacks: queued.filter(i => i.on === lifecycle).map(i => i.name)
  });
}
