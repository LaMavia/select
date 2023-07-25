import { GenericKey } from '../types/GenericKey'
import { Selector } from '../types/Selector'
import { extract } from '../helpers/extract'

const dummyTarget = /* c8 ignore next */ (() => {}) as any

const selectProxy = <S>(keys: GenericKey[]): Selector<S> =>
  new Proxy(dummyTarget, {
    get: (_, key) => selectProxy([...keys, key as keyof S]),
    apply: (_1, _2, argArray) => extract(argArray[0], keys)
  })

export const makeSelector = <T>(): Selector<T> => selectProxy([])

/* c8 ignore start */
if (import.meta.vitest) {
  const { describe, expect, it, expectTypeOf } = import.meta.vitest

  const state: { a: number; b?: { a: string; b: number[] } } = {
    a: 1,
    b: {
      a: 'hello',
      b: [1]
    }
  }

  describe('makeSelector', () => {
    const $ = makeSelector<typeof state>()

    it('succeeds without keys', () => expect($(state)).to.deep.equal(state))
    it('succeeds on 1 key', () => expect($.a(state)).toEqual(state['a']))
    it('succeeds on 2 keys', () => expect($.b.a(state)).toEqual(state.b?.a))
    it('propagates optional props', () => {
      expectTypeOf($.b.b).toMatchTypeOf<
        (_state: typeof state) => number[] | undefined
      >()
    })
  })
}
/* c8 ignore stop */
