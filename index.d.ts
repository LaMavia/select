import { GenericKey } from "./lib/types/GenericKey";
import { Selector } from "./lib/types/Selector";

export function makeSelector<T>(...keys: GenericKey[]): Selector<T>;
