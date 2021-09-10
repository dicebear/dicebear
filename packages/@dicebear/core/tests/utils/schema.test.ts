import { utils, schema } from '../../dist/';

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
    bar: 123,
  });
});
