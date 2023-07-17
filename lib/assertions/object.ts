import { GenericKey } from "../types/GenericKey";

export const isKeyOf = <O>(key: GenericKey, object: O): key is keyof O =>
  typeof object === "object" && object !== null && key in object;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const keys = {
    string: ["", "key"],
    symbol: [Symbol.iterator],
    number: [0, 1],
  };

  const runTest = (test: (key: GenericKey) => unknown) => {
    keys["string"].forEach(test);
    keys["number"].forEach(test);
    keys["symbol"].forEach(test);
  };

  describe("isKeyOf", () => {
    it("false on object=null", () =>
      runTest((key) => expect(isKeyOf(key, null), String(key)).toBeFalsy()));

    it("succeeds on existing key", () =>
      runTest((key) =>
        expect(isKeyOf(key, { [key]: 1 }), String(key)).toBeTruthy()
      ));

    it("fails on non-existing key", () =>
      runTest((key: GenericKey) =>
        expect(isKeyOf(key, {}), String(key)).toBeFalsy()
      ));
  });
}
