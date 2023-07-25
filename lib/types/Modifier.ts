/*
  grammar:
    <fragment> := <pure><optional_modifier>?
*/
namespace Modifier {
  type ApplyOptionalModifier<
    T,
    Fragment extends string,
    OptionalModifier extends string
  > = Fragment extends `${infer _}${OptionalModifier}` ? T | undefined : T

  export type Apply<
    T,
    Fragment extends string,
    OptionalModifier extends string
  > = ApplyOptionalModifier<T, Fragment, OptionalModifier>
}

namespace StripModifiers {
  type StripOptionalModifier<
    Fragment extends string,
    OptionalModifier extends string
  > = Fragment extends `${infer Pure}${OptionalModifier}` ? Pure : Fragment

  export type StripModifiers<
    Fragment extends string,
    OptionalModifier extends string
  > = StripOptionalModifier<Fragment, OptionalModifier>
}

type Frag = 'Hello?'
type OptMod = 'H'
type X = StripModifiers.StripModifiers<Frag, OptMod>
type Y = Modifier.Apply<string, Frag, OptMod>
