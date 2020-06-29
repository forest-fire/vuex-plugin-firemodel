import { FmConfigAction } from "../../private";
import { FmEvents } from "firemodel";
export declare type IFmConfigActions = keyof typeof FmConfigAction;
export declare type IFmCrudActions = keyof typeof FmEvents;
export declare type IFmActions = IFmConfigActions & IFmCrudActions;
