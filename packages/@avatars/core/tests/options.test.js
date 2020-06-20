const Avatars = require('../');

test('options.resolve', () => {
  let options = {
    foo: {
      a: true,
      b: true,
      c: Avatars.expr.ref('bar'),
      d: false,
    },
    bar: false,
    baz: ['a', 'b', 'c', 'd'],
  };

  expect(Avatars.options.process(options)).toEqual({ foo: 'a', bar: false, baz: 'b' });
});
