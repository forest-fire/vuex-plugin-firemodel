/**
 * The **mutations** to the `@firemodel` state node; this state node will be off the
 * root of a state tree which is defined by the application but remains
 * unknown/generic to this plugin
 */
export declare const mutations: {
    [x: string]: import("vuex").Mutation<import("../..").IFiremodelState>;
};
export declare type IFiremodelMutation = keyof typeof mutations;
