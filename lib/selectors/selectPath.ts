import { Paths, Split, TypeOfFragments } from '../types/path'
import { extract } from '../helpers/extract'

export const makePathSelector =
  <T extends object>() =>
  <P extends Paths<T>>(path: P) =>
  (state: T): TypeOfFragments<T, Split<P, '.'>> =>
    extract(state, path.split('.'))

/* c8 ignore start */
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest

  const state: { a: number; b?: { a: string; b: number[] } } = {
    a: 1,
    b: {
      a: 'hello',
      b: [1]
    }
  }

  describe('makePathSelector', () => {
    const $ = makePathSelector<typeof state>()

    it('succeeds without keys', () => expect($('')(state)).to.deep.equal(state))
    it('succeeds on 1 key', () => expect($('a')(state)).toEqual(state['a']))
    it('succeeds on 2 keys', () => expect($('b.a')(state)).toEqual(state.b?.a))
  })
}
/* c8 ignore stop */
