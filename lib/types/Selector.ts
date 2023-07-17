export type Selector<S, T = S> = T extends object
  ? {
      (state: S): T;
    } & { [K in keyof T]: Selector<S, T[K]> }
  : (state: S) => T;
