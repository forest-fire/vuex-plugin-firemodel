import { IDictionary } from "common-types";
/**
 * Removes a property (or set of properties) from a hash/dictionary
 */
export function removeProperty<T extends Record<string, unknown> = IDictionary>(
  hash: T,
  ...remove: (string & keyof T)[]
) {
  const output: Partial<T> = {};
  Object.keys(hash)
    .filter((prop: string & keyof T) => !remove.includes(prop))
    .forEach((prop: string & keyof T) => (output[prop] = hash[prop]));
  return output;
}
