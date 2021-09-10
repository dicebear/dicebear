import { utils } from '../../dist';

test('Defaults should be returned in options.', () => {
  const options = utils.options.merge(
    {
      create: () => ({ attributes: { viewBox: '' }, body: '' }),
      meta: {},
      schema: {},
    },
    {}
  );

  expect(options.radius).toEqual(0);
});
