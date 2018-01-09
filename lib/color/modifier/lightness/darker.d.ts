import Random from '../../../helper/random';
import Color from '../../../model/color';
import ColorSet from '../../../model/colorSet';
/**
 * Ensures that the selected color is darker than a reference color.
 */
export default class BrighterOrDarkerThan extends ColorSet {
    private reference;
    private difference;
    constructor(colors: Color[] | ColorSet, reference: ColorSet, difference: number);
    getColor(random: Random): Color;
}
