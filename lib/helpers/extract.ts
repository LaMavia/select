import { isKeyOf } from '../assertions/object'
import { GenericKey } from '../types/GenericKey'

export const extract = <S extends object, T>(state: S, keys: GenericKey[]): T =>
  keys.reduce(
    (u, k) =>
      isKeyOf(k, u)
        ? u[k]
        : k === ''
        ? u
        : (undefined as any) /* types around selectors will catch it */,
    state
  ) as unknown as T

/* c8 ignore start */
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('extract', () => {
    it('returns undefined when key not found', () =>
      expect(extract({ a: 1 }, ['a', 'b'])).toEqual(undefined))
    it('successfully accesses existing properties', () => {
      const object = {
        a: 1,
        b: {
          a: 'prop',
          b: {
            a: [1]
          }
        },
        '': 5
      }

      expect(extract(object, ['a'])).toEqual(1)
      expect(extract(object, ['b', 'a'])).toEqual('prop')
      expect(extract(object, ['b', 'b', 'a'])).toEqual([1])
      expect(extract(object, ['b', 'b', 'a', 0])).toEqual(1)
      expect(extract(object, [''])).toEqual(5)
    })
  })
}
/* c8 ignore stop */
