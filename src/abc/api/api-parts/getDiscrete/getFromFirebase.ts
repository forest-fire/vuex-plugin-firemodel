import { AbcApi,  serverRecords } from "../../../../private";

export async function getFromFirebase<T>(
  ctx: AbcApi<T>, 
  requestIds: string[]
) {
  const server = await serverRecords(ctx, requestIds, requestIds);
  return server
}