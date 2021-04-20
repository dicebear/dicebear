import { utils, schema } from '../../lib/';

test('All standards must be returned unless undefined.', () => {
  expect(
    utils.schema.defaults({
      properties: {
        foo: {
          default: 'FOO',
        },
        bar: {
          default: 123,
        },
        baz: {},
      },
    })
  ).toEqual({
    foo: 'FOO',
    bar: 123
  });
});

test('All aliases must be returned.', () => {
  expect(utils.schema.aliases(schema)).toEqual([
    ['s', 'seed'],
    ['r', 'radius'],
    ['w', 'width'],
    ['h', 'height'],
    ['m', 'margin'],
    ['b', 'background', 'backgroundColor'],
  ]);
});
