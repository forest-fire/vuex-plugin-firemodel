import { MutationTree } from "vuex";
import { Model } from "firemodel";
export declare type ListPropertyCandidates<T> = Pick<T, {
    [K in keyof T]: T[K] extends Model[] ? K : never;
}[keyof T]>;
export declare function listMutations<T>(postfix: keyof ListPropertyCandidates<T>): MutationTree<T>;
