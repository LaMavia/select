import { TemplateKey } from "./GenericKey";

type _Paths<T> = T extends object
  ? Extract<
      {
        [K in keyof T]: K extends TemplateKey
          ? `${K}` | `${K}.${_Paths<T[K]>}`
          : never;
      }[keyof T],
      string
    >
  : never;

export type Paths<T> = "" | _Paths<T>;

export type TypeOfPath<T, Path extends string> = T extends object
  ? Path extends `${infer H extends keyof T & TemplateKey}.${infer Tail}`
    ? TypeOfPath<T[H], Tail>
    : Path extends keyof T
    ? T[Path]
    : Path extends ""
    ? T
    : never
  : T;
