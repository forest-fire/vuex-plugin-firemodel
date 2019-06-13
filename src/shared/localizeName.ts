/**
 * converts a namespaced mutation or action to a localized one
 */
export function localizeName(name: string) {
  return name.replace("@firemodel/", "");
}
