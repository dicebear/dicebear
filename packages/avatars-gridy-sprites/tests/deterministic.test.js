const create = require("../lib/index").default;
const Random = require("@dicebear/avatars/lib/random").default;

test('Deterministic create', () => {
  let svg1 = create(new Random("arbitrary seed"), { deterministic: true });
  let svg2 = create(new Random("arbitrary seed"), { deterministic: true });

  expect(svg2).toEqual(svg1);
});
