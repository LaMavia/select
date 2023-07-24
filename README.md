# Typed-Selector

A simple, typesafe selector library.

Typed-selector exposes 3 types of selectors:

1. proxy selector ([makeSelector](#proxy-selector)) - the most ergonomic, yet the most expensive one;
1. simple path selector ([makePathSelector](#simple-path-selector)) - the cheapest but the least expressive one;
1. class-based path selector ([PathSelector](#class-based-path-selector)) - cheaper than proxy selector, and nearly as expressive.

## Proxy selector

Utilizes immutable proxies together with virtual properties to map object accesses to key fragments used is the final selector.

### Usage

Let us define a state of `State` as

```ts
interface State {
  a: number
  b: {
    a: string
    b: boolean[]
  }
}
```

You can later use `makeSelector` to define a custom selector:

```ts
import { makeSelector } from 'typed-selector'

// equivalent to: state => state
const $ = makeSelector<State>()

// state => state.a
$.a
// state => state.b.a
$.b.a
// state => state.b.b[0]
$.b.b[0]
```

Selectors can be saved at any point, and later extended:

```ts
const $ = makeSelector<State>()
const b$ = $.b.b
const b$first = b$[0]
```

## Simple path selector

Uses dot-separated key paths to make selectors. It's less expensive than `makeSelector` but also less expressive as it doesn't allow for prefixing. The path argument is strongly typed, and supports intellisense. The fragment separator is fixed at `'.'`. To use a custom separator, use `PathSelector` instead.

## Usage

```ts
import { makePathSelector } from 'typed-selector'

interface State {
  root: {
    files: {}
    dirs: {
      projects: {
        files: {}
        dirs: {
          'typed-selector': {
            files: {
              index: string
            }
            dirs: {}
          }
        }
      }
    }
  }
}

const $ = makePathSelector<State>()

const indexSelector: (state: State) => string = $(
  'root.dirs.projects.dirs.typed-selector.files.index'
)
```

## Class-based path selector

Uses immutable classes in combination with string paths. Allows for custom fragment separators, and prefixing.

### Constructors

`PathSelector` doesn't expose its raw constructor but exposes two factory functions:

1. `make(options)` - accepts all the options at once but setting a custom separator requires duplicating it as the second type parameter. All possible options are defined in `PathSelectorOptions`. For example:
   ```ts
   PathSelector.make<typeof state, '/'>({ separator: '/' })
   ```
1. `empty()` - creates a default PathSelector instance, using `'.'` as the separator. The separator can later be changed with `separator(newSeparator)`. For example:
   ```ts
   PathSelector.empty<typeof state>()
   // or with a custom selector
   PathSelector.empty<typeof state>().separator('/')
   ```

### Usage

```ts
import { PathSelector } from 'typed-selector'

interface State {
  a: number
  b: {
    a: string
    b: boolean[]
  }
}

declare const state: State

const $ = PathSelector.empty<State>()
const b$ = $.then('b')
// b: { a: string
//    , b: boolean[]
//    }
const b = b$.select(state)
const bArr$first = b$.separator('&').then('b&0')
```

## Examples

### styled-components theme selector

Let us define the theme as

```ts
interface DefaultTheme {
  fontSize: {
    large: string
    small: string
  }
  pallette: {
    primary: {
      text: string
      background: string
    }
    secondary: {
      text: string
      background: string
    }
  }
}
```

Later define the selector `$theme` as

```ts
import { ThemeProps } from 'styled-components'
import { makeSelector } from 'select'

const $theme = makeSelector<{ theme: DefaultTheme }>().theme
```

It can then be used as follows:

```ts
import { styled } from 'styled-components'

const $primary = $theme.pallette.primary

const StyledDiv = styled.div`
  font-size: ${$theme.fontSize.small};
  color: ${$primary.text};
  background-color: ${$primary.background};
`
```
