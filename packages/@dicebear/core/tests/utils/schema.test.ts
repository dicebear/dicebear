import { defaults as schemaDefaults } from '../../src/utils/schema';

test('All standards must be returned unless undefined.', () => {
  expect(
    schemaDefaults({
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
