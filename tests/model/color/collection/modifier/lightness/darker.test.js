const Darker = require('../../../../../../lib/model/color/collection/modifier/lightness/darker');
const Color = require('../../../../../../lib/model/color');
const ColorCollection = require('../../../../../../lib/model/color/collection');
const Random = require('../../../../../../lib/helper/random');

test('Light colors should become darker.', () => {
  let random = new Random('');
  let color1 = new ColorCollection([new Color('hsv(150, 150, 150)')]);
  let color2 = new ColorCollection([new Color('hsv(150, 150, 150)')]);

  expect(new Darker(color1, color2, 25).get(random).hsv).toEqual([150, 150, 125]);
});

test('Light colors should become not to dark.', () => {
  let random = new Random('');
  let color1 = new ColorCollection([new Color('hsv(150, 150, 150)')]);
  let color2 = new ColorCollection([new Color('hsv(150, 150, 150)')]);

  expect(new Darker(color1, color2, 250).get(random).hsv).toEqual([150, 150, 0]);
});
