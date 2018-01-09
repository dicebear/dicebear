import Color from './color';
import Random from '../helper/random';
export default class ColorSet {
    private colors;
    private pickedColors;
    /**
     * @param colors
     */
    constructor(colors: Color[] | ColorSet);
    /**
     * Returns a color
     *
     * @param random
     */
    getColor(random: Random): Color;
}
