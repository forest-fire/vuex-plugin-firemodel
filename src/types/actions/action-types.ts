import { FmConfigAction } from "../../private";
import { FmEvents } from "firemodel";

export type IFmConfigActions = keyof typeof FmConfigAction;
export type IFmCrudActions = keyof typeof FmEvents;
export type IFmActions = IFmConfigActions & IFmCrudActions;