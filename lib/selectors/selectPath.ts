import { Paths, Split, TypeOfPath } from '../types/path'
import { extract } from '../helpers/extract'

export const selectPath =
  <T extends object>() =>
  <P extends Paths<T>>(path: P) =>
  (state: T): TypeOfPath<T, Split<P, '.'>> =>
    extract(state, path.split('.'))
