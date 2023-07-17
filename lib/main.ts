import { selectProxy } from "./helpers/selectProxy";
import { Selector } from "./types/Selector";

export const makeSelector = <T>(): Selector<T> => selectProxy([]);

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  const state = {
    a: 1,
    b: {
      a: "hello",
      b: [1],
    },
  };
  const $_ = makeSelector<typeof state>();

  describe("makeSelector", () => {
    it("succeeds without keys", () => expect($_(state)).to.deep.equal(state));
    it("succeeds on 1 key", () => expect($_.a(state)).toEqual(state["a"]));
    it("succeeds on 2 keys", () =>
      expect($_.b.a(state)).toEqual(state["b"]["a"]));
  });
}
