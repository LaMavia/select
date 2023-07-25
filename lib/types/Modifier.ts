import { TemplateKey } from './GenericKey'

/*
  grammar:
    <fragment> := <pure><optional_modifier>?
*/
export namespace Modifier {
  type ApplyOptionalModifier<
    T,
    Fragment extends TemplateKey,
    OptionalModifier extends string
  > = Fragment extends `${infer _}${OptionalModifier}` ? T | undefined : T

  export type Apply<
    T,
    Fragment extends TemplateKey,
    OptionalModifier extends string
  > = ApplyOptionalModifier<T, Fragment, OptionalModifier>
}

export namespace StripModifiers {
  type StripOptionalModifier<
    Fragment extends TemplateKey,
    OptionalModifier extends string
  > = Fragment extends `${infer Pure}${OptionalModifier}` ? Pure : Fragment

  export type StripModifiers<
    Fragment extends TemplateKey,
    OptionalModifier extends string
  > = StripOptionalModifier<Fragment, OptionalModifier>
}
