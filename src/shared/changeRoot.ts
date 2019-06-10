import { IDictionary } from "firemock";

export const changeRoot = (state: IDictionary, newValues: IDictionary) => {
  Object.keys(newValues).forEach(v => {
    state[v] = newValues[v];
  });
  const removed = Object.keys(state).filter(k => !Object.keys(newValues).includes(k));
  Object.keys(removed).forEach(k => {
    delete state[k];
  });
  return state;
};
