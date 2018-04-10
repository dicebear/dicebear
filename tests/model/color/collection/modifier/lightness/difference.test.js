const Difference = require('../../../../../../lib/model/color/collection/modifier/lightness/difference').default;
const Color = require('../../../../../../lib/model/color').default;
const ColorCollection = require('../../../../../../lib/model/color/collection').default;
const Random = require('../../../../../../lib/helper/random').default;

test('Light colors should become darker.', () => {
  let random = new Random('');
  let color1 = new ColorCollection([new Color('hsv(150, 150, 149)')]);
  let color2 = new ColorCollection([new Color('hsv(150, 150, 150)')]);

  expect(new Difference(color1, color2, 25).get(random).hsv).toEqual([150, 150, 125]);
});

test('Dark colors should become darker.', () => {
  let random = new Random('');
  let color1 = new ColorCollection([new Color('hsv(150, 150, 151)')]);
  let color2 = new ColorCollection([new Color('hsv(150, 150, 150)')]);

  expect(new Difference(color1, color2, 25).get(random).hsv).toEqual([150, 150, 175]);
});
