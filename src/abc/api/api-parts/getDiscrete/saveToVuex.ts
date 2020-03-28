import { IDictionary } from "firemock";
import { getStore, IAbcMutation } from "../../../..";

export function saveToVuex(
  mutation: IAbcMutation,
  results: IDictionary
) {
  const store = getStore();
  store.commit(
    `${this.vuex.moduleName}/${mutation}`,
    results
  );
}