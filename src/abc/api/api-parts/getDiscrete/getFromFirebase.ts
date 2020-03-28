import { AbcRequestCommand, IDiscreteLocalResults, IDiscreteOptions } from "../../../..";
import { AbcApi, AbcResult } from "../..";
import { serverRecords } from "../../shared";

export async function getFromFirebase<T>(
  ctx: AbcApi<T>, 
  local: IDiscreteLocalResults<T> | undefined,
  options: IDiscreteOptions<T> = {},
  requestIds: string[]
) {
  const server = await serverRecords(ctx, requestIds, requestIds);

  const serverResults = new AbcResult(ctx, {
    type: "discrete",
    local,
    server,
    options
  }, {});

  return { server, serverResults }
}