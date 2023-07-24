import { TemplateKey } from './GenericKey'

type _Paths<T, Separator extends string> = T extends object
  ? Extract<
      {
        [K in keyof T]: K extends TemplateKey
          ? `${K}` | `${K}${Separator}${_Paths<T[K], Separator>}`
          : never
      }[keyof T],
      string
    >
  : never

export type Paths<T, Separator extends string = '.'> = '' | _Paths<T, Separator>

type _Split<
  Str extends string,
  Separator extends string,
  Acc extends string[]
> = Str extends `${infer Head extends string}${Separator}${infer Tail extends
  string}`
  ? _Split<Tail, Separator, [...Acc, Head]>
  : Acc

export type Split<Str extends string, Separator extends string> = _Split<
  Str,
  Separator,
  []
>

export type TypeOfPath<T, Path extends string[]> = T extends object
  ? Path extends [infer Head extends keyof T, ...infer Tail extends string[]]
    ? TypeOfPath<T[Head], Tail>
    : Path extends keyof T
    ? T[Path]
    : Path extends ''
    ? T
    : never
  : T
