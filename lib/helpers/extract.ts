import { isKeyOf } from '../assertions/object'
import { GenericKey } from '../types/GenericKey'

export const extract = <S extends object, T>(state: S, keys: GenericKey[]): T =>
  keys.reduce((u, k) => (isKeyOf(k, u) ? u[k] : u), state) as unknown as T

// c8 ignore start
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('extract', () => {
    it('reduces to identity when key not found', () =>
      expect(extract({ a: 1 }, ['a', 'b'])).toEqual(1))
    it('successfully accesses existing properties', () => {
      const object = {
        a: 1,
        b: {
          a: 'prop',
          b: {
            a: [1]
          }
        }
      }

      expect(extract(object, ['a'])).toEqual(1)
      expect(extract(object, ['b', 'a'])).toEqual('prop')
      expect(extract(object, ['b', 'b', 'a'])).toEqual([1])
      expect(extract(object, ['b', 'b', 'a', 0])).toEqual(1)
    })
  })
}
// c8 ignore start
