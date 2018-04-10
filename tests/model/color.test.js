const Color = require('../../lib/model/color').default;

test('Hex converter.', () => {
  let color = '#556677';

  expect(new Color(color).rgb).toEqual([85, 102, 119]);
  expect(new Color(color).rgba).toEqual([85, 102, 119, 1]);
  expect(new Color(color).hsv).toEqual([210, 29, 47]);
});

test('Rgb converter.', () => {
  let color = 'rgb(85, 102, 119)';

  expect(new Color(color).hex).toEqual('#556677');
  expect(new Color(color).rgba).toEqual([85, 102, 119, 1]);
  expect(new Color(color).hsv).toEqual([210, 29, 47]);
});

test('Rgba converter.', () => {
  let color = 'rgba(85, 102, 119, 1)';

  expect(new Color(color).rgb).toEqual([85, 102, 119]);
  expect(new Color(color).hex).toEqual('#556677');
  expect(new Color(color).hsv).toEqual([210, 29, 47]);
});

test('Hsv converter.', () => {
  let color = 'hsv(210, 29, 47)';

  expect(new Color(color).rgb).toEqual([85, 102, 120]);
  expect(new Color(color).rgba).toEqual([85, 102, 120, 1]);
  expect(new Color(color).hex).toEqual('#556678');
});
