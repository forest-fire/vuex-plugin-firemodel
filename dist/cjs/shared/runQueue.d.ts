import { IFmEventContext, IFmLifecycleEvents } from "../types/index";
/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
export declare function runQueue<T>(ctx: IFmEventContext<T>, lifecycle: IFmLifecycleEvents): Promise<void>;
