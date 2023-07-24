import { GenericKey } from '../types/GenericKey'
import { Selector } from '../types/Selector'
import { extract } from '../helpers/extract'

const dummyTarget = /* c8 ignore next */ (() => {}) as any

export const selectProxy = <S>(keys: GenericKey[]): Selector<S> =>
  new Proxy(dummyTarget, {
    get: (_, key) => selectProxy([...keys, key as keyof S]),
    apply: (_1, _2, argArray) => extract(argArray[0], keys)
  })
