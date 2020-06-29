/** adds the `@firemodel` namespace in front of a localized name */
export function addNamespace(event: string) {
  return `@firemodel/${event}`;
}
