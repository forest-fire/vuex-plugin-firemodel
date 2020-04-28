import { IDiscreteLocalResults, IDiscreteOptions, AbcApi, AbcResult } from "../../../../private";
import { serverRecords } from "../../shared";

export async function getFromFirebase<T>(
  ctx: AbcApi<T>, 
  local: IDiscreteLocalResults<T> | undefined,
  options: IDiscreteOptions<T> = {},
  requestIds: string[]
) {
  const server = await serverRecords(ctx, requestIds, requestIds);

  const serverResults = await AbcResult.create(ctx, {
    type: "discrete",
    local,
    server,
    options
  });

  return { server, serverResults }
}