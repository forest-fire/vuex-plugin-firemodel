import { FmEvents } from "firemodel";
export declare const errors: <T>() => {
    [FmEvents.UNEXPECTED_ERROR](_: any, payload: any): Promise<void>;
};
