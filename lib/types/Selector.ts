export type Selector<S, T = S, RT = T> = T extends object
  ? {
      (state: S): RT
    } & {
      [K in keyof T]-?: Selector<
        S,
        Exclude<T[K], undefined>,
        T[K] | Extract<RT, undefined>
      >
    }
  : (state: S) => RT
