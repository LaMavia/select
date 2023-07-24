import { extract } from '../helpers/extract'
import { Paths, Split, TypeOfPath } from '../types/path'

export interface PathSelectorOptions<Separator extends string> {
  separator: Separator
}

export interface PathSelectorInterface<
  T extends object,
  Fragments extends string[],
  Separator extends string
> {
  separator<NewSeparator extends string>(
    separator: NewSeparator
  ): PathSelector<T, Fragments, NewSeparator>

  then<Path extends Paths<T, Separator>>(
    path: Path
  ): PathSelectorInterface<
    T,
    [...Fragments, ...Split<Path, Separator>],
    Separator
  >

  select(state: T): TypeOfPath<T, Fragments>
}

export class PathSelector<
  T extends object,
  Fragments extends string[] = [],
  Separator extends string = '.'
> implements PathSelectorInterface<T, Fragments, Separator>
{
  #fragments: string[]
  #options: PathSelectorOptions<Separator>

  private constructor(
    fragments: string[],
    options: PathSelectorOptions<Separator>
  ) {
    this.#options = options
    this.#fragments = fragments
  }

  static empty<T extends object>(): PathSelector<T, [], '.'> {
    return new PathSelector([], { separator: '.' })
  }

  static make<T extends object, Separator extends string = '.'>(
    options: PathSelectorOptions<Separator>
  ): PathSelector<T, [], Separator> {
    return new PathSelector([], options)
  }

  then<Path extends Paths<T, Separator>>(
    path: Path
  ): PathSelectorInterface<
    T,
    [...Fragments, ...Split<Path, Separator>],
    Separator
  > {
    return new PathSelector<
      T,
      [...Fragments, ...Split<Path, Separator>],
      Separator
    >(
      [...this.#fragments, ...path.split(this.#options.separator)],
      this.#options
    )
  }

  select(state: T): TypeOfPath<T, Fragments> {
    return extract(state, this.#fragments)
  }

  separator<NewSeparator extends string>(
    separator: NewSeparator
  ): PathSelector<T, Fragments, NewSeparator> {
    return new PathSelector<T, Fragments, NewSeparator>(
      this.#fragments,
      Object.assign(this.#options, { separator })
    )
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  const state = {
    a: 1,
    b: {
      a: 'hello',
      b: [1]
    }
  }

  describe('PathSelector', () => {
    const $ = PathSelector.empty<typeof state>()

    it('succeeds without keys', () =>
      expect($.select(state)).to.deep.equal(state))
    it('succeeds on 1 key', () =>
      expect($.then('a').select(state)).toEqual(state['a']))
    it('succeeds on 2 keys', () =>
      expect($.then('b.a').select(state)).toEqual(state['b']['a']))

    it('works with a custom separator', () => {
      const $ = PathSelector.make<typeof state, '/'>({ separator: '/' })
      expect($.then('b/b/0').select(state)).toEqual(state.b.b[0])
    })

    describe('options', () => {
      it('sets separator', () => {
        const $ = PathSelector.empty<typeof state>().separator('&')
        expect($.then('b&b&0').select(state)).toEqual(state.b.b[0])
      })
    })
  })
}
