import { AbcError } from "@/errors";
import { IDictionary } from "common-types";

/**
 * Given a Primary Key _reference_ string; this function will find the record
 * which matches the primary key.
 *
 * If no record is found then `false` is returned. If _more_ than one result is
 * found than an error is thrown.
 */
export function findPk<T extends IDictionary>(
  pk: string,
  records: T[]
): T | false {
  const [id, ...keyValue] = pk.split("::");
  let found = records.filter(i => i.id === id);

  keyValue.forEach(kv => {
    const [k, v] = kv.split(":");
    found = found.filter(i => i[k] === v);
  });

  if (found.length > 1) {
    throw new AbcError(
      `Attempt to find the primary key "${pk}" resulted in more than one record being matched!`,
      "not-allowed"
    );
  }

  return found.length === 1 ? found[0] : false;
}
