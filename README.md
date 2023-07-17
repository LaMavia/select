# Select

A simple, typesafe selector library.

## Usage

When dealing with a state of type `State`, start by defining a new selector `$`
```ts
import { makeSelector } from 'selector'

const $ = makeSelector<State>()
```

Instead of using a lambda function, you can substitute it for `$`
```ts
import { makeSelector } from 'selector'

const $ = makeSelector<State>()

// before
useSelector((state) => state.a.b)

// after
useSelector($.a.b)
```

## Examples

### styled-components theme selector

Let us define the theme as

```ts
interface DefaultTheme {
  fontSize: {
    large: string,
    small: string
  },
  pallette: {
    primary: {
      text: string,
      background: string
    },
    secondary: {
      text: string,
      background: string
    }
  }
}
```

Later define the selector `$theme` as

```ts
import { ThemeProps } from 'styled-components'
import { makeSelector } from 'select'

const $theme = makeSelector<{theme: DefaultTheme}>().theme
```

It can then be used as follows:

```ts
import { styled } from 'styled-components'

const $primary = $theme.pallette.primary

const StyledDiv = styled.div`
  font-size:        ${$theme.fontSize.small};
  color:            ${$primary.text}        ;
  background-color: ${$primary.background}  ;
`
```

