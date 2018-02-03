const Brighter = require('../../../../../../lib/model/color/collection/modifier/lightness/brighter');
const Color = require('../../../../../../lib/model/color');
const ColorCollection = require('../../../../../../lib/model/color/collection');
const Random = require('../../../../../../lib/helper/random');

test('Dark colors should become brighter.', () => {
  let random = new Random('');
  let color1 = new ColorCollection([new Color('hsv(150, 150, 150)')]);
  let color2 = new ColorCollection([new Color('hsv(150, 150, 150)')]);

  expect(new Brighter(color1, color2, 25).get(random).hsv).toEqual([150, 150, 175]);
});

test('Light colors should become not to bright.', () => {
  let random = new Random('');
  let color1 = new ColorCollection([new Color('hsv(150, 150, 150)')]);
  let color2 = new ColorCollection([new Color('hsv(150, 150, 150)')]);

  expect(new Brighter(color1, color2, 360).get(random).hsv).toEqual([150, 150, 360]);
});
