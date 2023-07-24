# SelOb

A simple, typesafe selector library.

## Proxy selector

### Usage

When dealing with a state of type `State`, start by defining a new selector `$`

```ts
import { makeSelector } from 'typed-selector'

const $ = makeSelector<State>()
```

Instead of using a lambda function, you can substitute it for `$`

```ts
import { makeSelector } from 'typed-selector'

const $ = makeSelector<State>()

// before
useSelector(state => state.a.b)

// after
useSelector($.a.b)
```

## Path selector

Uses dot-separated key paths to make selectors. It's less expensive than `makeSelector` but also less expressive as it doesn't allow for prefixing.

The path argument is strongly typed, and supports intellisense.

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
