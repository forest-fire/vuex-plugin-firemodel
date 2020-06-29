import { IFmLifecycleContext, IFmLifecycleEvent } from "../types/index";
/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
export declare function runQueue<T>(ctx: IFmLifecycleContext<T>, lifecycle: IFmLifecycleEvent): Promise<void>;
