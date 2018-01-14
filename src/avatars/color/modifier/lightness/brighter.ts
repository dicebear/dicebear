import Random from '../../../helper/random';
import Color from '../../../model/color';
import ColorSet from '../../../model/colorSet';

/**
 * Ensures that the selected color is lighter than a reference color.
 */
export default class BrighterOrDarkerThan extends ColorSet {
  private reference: ColorSet;
  private difference: number;

  constructor(colors: Color[] | ColorSet, reference: ColorSet, difference: number) {
    super(colors);

    this.reference = reference;
    this.difference = difference;
  }

  getColor(random: Random) {
    let color = super.getColor(random);
    let referenceColor = this.reference.getColor(random);

    let colorHsl = color.hsl;
    let referenceColorHsl = referenceColor.hsl;

    if (colorHsl[2] >= referenceColorHsl[2] + this.difference) {
      return color;
    }

    colorHsl[2] = colorHsl[2] + this.difference;

    if (colorHsl[2] > 100) {
      colorHsl[2] = 100;
    }

    let brighterColor = color.clone();
    brighterColor.hsl = colorHsl;

    return brighterColor;
  }
}
