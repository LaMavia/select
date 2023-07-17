import { GenericKey } from "../types/GenericKey";

export const isKeyOf = <O>(key: GenericKey, object: O): key is keyof O =>
  typeof object === "object" && object !== null && key in object;
