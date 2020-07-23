import { AbcApi, discreteServerRecords } from "@/abc";

/**
 * REMOVE?
 */
export async function getFromFirebase<T>(ctx: AbcApi<T>, requestIds: string[]) {
  const server = await discreteServerRecords(ctx, requestIds, requestIds);
  return server;
}
