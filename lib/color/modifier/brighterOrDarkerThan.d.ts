import Random from '../../helper/random';
import Color from '../../model/color';
import ColorSet from '../../model/colorSet';
export default class BrighterOrDarkerThan extends ColorSet {
    private referenceColor;
    private differenceBrightness;
    private differenceDarkness;
    /**
     * @param colors
     * @param referenceColor
     * @param differenceBrightness
     * @param differenceDarkness
     */
    constructor(colors: Color[] | ColorSet, referenceColor: ColorSet, differenceBrightness: number, differenceDarkness: number);
    /**
     * Returns a color
     *
     * @param random
     * @param callback
     */
    getColor(random: Random): Promise<Color>;
}
