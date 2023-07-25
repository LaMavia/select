import { selectPath } from './selectors/selectPath'
import { selectProxy } from './selectors/selectProxy'
import { Selector } from './types/Selector'

export const makeSelector = <T>(): Selector<T> => selectProxy([])
export const makePathSelector = selectPath
export * from './selectors/PathSelector'

/* c8 ignore start */
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest

  const state = {
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
    it('succeeds on 2 keys', () =>
      expect($.b.a(state)).toEqual(state['b']['a']))
  })

  describe('makePathSelector', () => {
    const $ = makePathSelector<typeof state>()

    it('succeeds without keys', () => expect($('')(state)).to.deep.equal(state))
    it('succeeds on 1 key', () => expect($('a')(state)).toEqual(state['a']))
    it('succeeds on 2 keys', () =>
      expect($('b.a')(state)).toEqual(state['b']['a']))
  })
}
/* c8 ignore stop */
