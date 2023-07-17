import { selectProxy } from "./helpers/selectProxy";
import { GenericKey } from "./types/GenericKey";
import { Selector } from "./types/Selector";

export const makeSelector = <T>(...keys: GenericKey[]): Selector<T> =>
  selectProxy(keys);
