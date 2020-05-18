import { IDiscreteLocalResults, IDiscreteOptions, AbcApi, AbcResult } from "../../../../private";
import { serverRecords } from "../../shared";

export async function getFromFirebase<T>(
  ctx: AbcApi<T>, 
  requestIds: string[]
) {
  const server = await serverRecords(ctx, requestIds, requestIds);
  return server
}