import { isKeyOf } from "../assertions/object";
import { GenericKey } from "../types/GenericKey";

export const extract = <S extends object>(state: S, keys: GenericKey[]) =>
  keys.reduce((u, k) => (isKeyOf(k, u) ? u[k] : u), state);
