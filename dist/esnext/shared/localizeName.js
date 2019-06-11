/**
 * converts a namespaced mutation or action to a localized one
 */
export function localizeName(name) {
    return name.replace("@firemodel/", "");
}
