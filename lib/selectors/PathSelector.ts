import { extract } from '../helpers/extract'
import { Paths, Split, TypeOfFragments } from '../types/path'

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

  select(state: T): TypeOfFragments<T, Fragments>
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

  then = <Path extends Paths<T, Separator>>(
    path: Path
  ): PathSelectorInterface<
    T,
    [...Fragments, ...Split<Path, Separator>],
    Separator
  > =>
    new PathSelector<T, [...Fragments, ...Split<Path, Separator>], Separator>(
      [...this.#fragments, ...path.split(this.#options.separator)],
      this.#options
    )

  select = (state: T): TypeOfFragments<T, Fragments> =>
    extract(state, this.#fragments)

  separator = <NewSeparator extends string>(
    separator: NewSeparator
  ): PathSelector<T, Fragments, NewSeparator> =>
    new PathSelector<T, Fragments, NewSeparator>(
      this.#fragments,
      Object.assign(this.#options, { separator })
    )
}

/* c8 ignore start */
if (import.meta.vitest) {
  const { describe, it, expect, expectTypeOf } = import.meta.vitest

  const state: { a: number; b?: { a: string; b: number[] } } = {
    a: 1,
    b: {
      a: 'hello',
      b: [1]
    }
  }

  describe('PathSelector', () => {
    const $ = PathSelector.empty<typeof state>()

    it('succeeds without keys', () => {
      const $$ = $.select

      expect($$(state)).to.deep.equal(state)
      expectTypeOf($$).toMatchTypeOf<(_state: typeof state) => typeof state>()
    })
    it('succeeds on 1 key', () => {
      const $$ = $.then('a').select

      expect($$(state)).toEqual(state['a'])
      expectTypeOf($$).toMatchTypeOf<
        (_state: typeof state) => (typeof state)['a']
      >()
    })
    it('succeeds on 2 keys', () => {
      const $$ = $.then('b.a').select

      expect($$(state)).toEqual(state.b?.a)
      expectTypeOf($$).toMatchTypeOf<
        (_state: typeof state) => string | undefined
      >()
    })

    it('works with a custom separator', () => {
      const $ = PathSelector.make<typeof state, '/'>({ separator: '/' })
      const $$ = $.then('b/b/0').select

      expect($$(state)).toEqual(state.b?.b[0])
      expectTypeOf($$).toMatchTypeOf<
        (_state: typeof state) => number | undefined
      >()
    })

    it('works with unions', () => {
      const state: { a: { b: number } | { c: string } } = {
        a: {
          b: 1
        }
      }
      const $$ = PathSelector.empty<typeof state>().then('a.c').select
      expect($$(state)).toEqual(undefined)
      expectTypeOf($$).toMatchTypeOf<
        (_state: typeof state) => string | undefined
      >()
    })

    describe('options', () => {
      it('separator', () => {
        const $ = PathSelector.empty<typeof state>().separator('&')
        const $$ = $.then('b&b&0').select

        expect($$(state)).toEqual(state.b?.b[0])
        expectTypeOf($$).toMatchTypeOf<
          (_state: typeof state) => number | undefined
        >()
      })
    })
  })
}
/* c8 ignore stop */
