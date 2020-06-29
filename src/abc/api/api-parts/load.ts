import { Model } from "firemodel";

export async function loadQuery<T extends Model>(
  query: any,
  options: any
): Promise<T[]> {
  return Promise.resolve([]);
}

export async function loadIds<T extends Model>(...args: any[]): Promise<T[]> {
  return Promise.resolve([]);
}
