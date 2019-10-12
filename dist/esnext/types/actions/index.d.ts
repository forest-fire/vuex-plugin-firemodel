import { FmConfigAction } from "./FmConfigActions";
import { FmEvents } from "firemodel";
export * from "./FmConfigActions";
export declare type IFmConfigActions = keyof typeof FmConfigAction;
export declare type IFmCrudActions = keyof typeof FmEvents;
export declare type IFmActions = IFmConfigActions & IFmCrudActions;
