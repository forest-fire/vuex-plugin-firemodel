import { IAbcAllQueryDefinition, AbcRequestCommand } from "../../../types";
import { AbcApi } from "../AbcApi";
import { AbcResult, IQueryOptions } from "../../..";
declare let all: <T>(defn?: IAbcAllQueryDefinition<T> | Pick<IAbcAllQueryDefinition<T>, "limit" | "offset">, options?: IQueryOptions<T>) => (command: AbcRequestCommand, ctx: AbcApi<T>) => Promise<AbcResult<T>>;
export { all };
