import { Paths, TypeOfPath } from "../types/path";
import { extract } from "./extract";

export const selectPath =
  <T extends object>() =>
  <P extends Paths<T>>(path: P) =>
  (state: T): TypeOfPath<T, P> =>
    extract(state, path.split("."));
