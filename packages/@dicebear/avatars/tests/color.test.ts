import Color from '../lib/color';

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

test('Dark colors should become brighter.', () => {
  let color1 = new Color('hsv(150, 150, 150)');
  let color2 = new Color('hsv(150, 150, 150)');

  expect(color1.brighterThan(color2, 25).hsv).toEqual([150, 150, 175]);
});

test('Light colors should become not to bright.', () => {
  let color1 = new Color('hsv(150, 150, 150)');
  let color2 = new Color('hsv(150, 150, 150)');

  expect(color1.brighterThan(color2, 360).hsv).toEqual([150, 150, 360]);
});

test('Light colors should become darker.', () => {
  let color1 = new Color('hsv(150, 150, 150)');
  let color2 = new Color('hsv(150, 150, 150)');

  expect(color1.darkerThan(color2, 25).hsv).toEqual([150, 150, 125]);
});

test('Light colors should become not to dark.', () => {
  let color1 = new Color('hsv(150, 150, 150)');
  let color2 = new Color('hsv(150, 150, 150)');

  expect(color1.darkerThan(color2, 250).hsv).toEqual([150, 150, 0]);
});

test('Light colors should become darker.', () => {
  let color1 = new Color('hsv(150, 150, 149)');
  let color2 = new Color('hsv(150, 150, 150)');

  expect(color1.brighterOrDarkerThan(color2, 25).hsv).toEqual([150, 150, 125]);
});

test('Dark colors should become darker.', () => {
  let color1 = new Color('hsv(150, 150, 151)');
  let color2 = new Color('hsv(150, 150, 150)');

  expect(color1.brighterOrDarkerThan(color2, 25).hsv).toEqual([150, 150, 175]);
});
