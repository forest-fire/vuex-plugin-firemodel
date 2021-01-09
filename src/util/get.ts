import { IModel } from "firemodel";

/**
 * Gets a value in a deeply nested object. This is a replacement to `lodash.get`
 *
 * @param obj the base object to get the value from
 * @param dotPath the path to the object, using "." as a delimiter
 * @param defaultValue optionally you may state a default value if the operation results in `undefined`
 */
export function get<T extends unknown | IModel = unknown | IModel>(
  obj: T,
  dotPath: string,
  defaultValue?: T
): T {
  const parts = dotPath.split(".");
  let value: T = obj;

  parts.forEach(p => {
    value =
      typeof value === "object" && Object.keys(value).includes(p)
        ? value[p as keyof typeof value]
        : undefined;
  });

  return value ? value : defaultValue;
}
