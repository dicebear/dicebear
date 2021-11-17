import { merge as mergeOptions } from '../../src/utils/options';

test('Defaults should be returned in options.', () => {
  const options = mergeOptions(
    {
      create: () => ({ attributes: { viewBox: '' }, body: '' }),
      meta: {},
      schema: {},
    },
    {}
  );

  expect(options.radius).toEqual(0);
});
