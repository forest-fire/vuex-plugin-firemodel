import { IFmLifecycleEvents, IAuthChangeContext } from "../types/index";
/**
 * **runQueue**
 *
 * pulls items off the lifecycle queue which match the lifecycle event
 */
export declare function runQueue<T>(ctx: IAuthChangeContext<T>, lifecycle: IFmLifecycleEvents): Promise<void>;
