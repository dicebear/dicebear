import Random from '../../../helper/random';
import Color from '../../../model/color';
import ColorSet from '../../../model/colorSet';

import Brighter from './brighter';
import Darker from './darker';

/**
 * Ensures that the selected color is darker or brighter than a reference color.
 */
export default class BrighterOrDarkerThan extends ColorSet {
  private reference: ColorSet;
  private brighter: Brighter;
  private darker: Darker;

  /**
   * @param colors
   * @param reference
   * @param difference
   */
  constructor(colors: Color[] | ColorSet, reference: ColorSet, difference: number) {
    super(colors);

    this.reference = reference;

    this.brighter = new Brighter(colors, reference, difference);
    this.darker = new Darker(colors, reference, difference);
  }

  /**
   * Returns a color
   *
   * @param random
   */
  getColor(random: Random) {
    let color = super.getColor(random);
    let referenceColor = this.reference.getColor(random);

    let colorHsl = color.hsl;
    let referenceColorHsl = referenceColor.hsl;

    if (colorHsl[2] <= referenceColorHsl[2]) {
      return this.brighter.getColor(random);
    } else {
      return this.darker.getColor(random);
    }
  }
}
