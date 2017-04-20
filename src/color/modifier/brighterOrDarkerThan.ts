import { RgbInterface, HslInterface } from '../../helper/color';
import { ColorInterface } from '../../color';
import Color from '../../color';
import * as OneColor from 'onecolor';

export default class BrighterOrDarkerThan extends Color {
    private referenceColor: ColorInterface;
    private differenceBrightness: number;
    private differenceDarkness: number;

    /**
     * @param colors
     * @param referenceColor
     * @param differenceBrightness
     * @param differenceDarkness
     */
    constructor(
        colors: RgbInterface[]|ColorInterface,
        referenceColor: ColorInterface,
        differenceBrightness: number,
        differenceDarkness: number
    ) {
        super(colors);

        this.referenceColor = referenceColor;

        this.differenceBrightness = differenceBrightness ? differenceBrightness / 100 : 0;
        this.differenceDarkness = differenceDarkness ? differenceDarkness / 100 : 0;
    }

    /**
     * Returns a color
     * 
     * @param chance
     * @param callback
     */
    getColor(chance: Chance.Chance, callback: (err, color: RgbInterface) => void) {
        super.getColor(chance, (err, color) => {
            this.referenceColor.getColor(chance, (err, referenceColor) => {
                let hslColor = OneColor([color[0], color[1], color[2], 255]).hsl(); // 50
                let hslReferenceColor = OneColor([referenceColor[0], referenceColor[1], referenceColor[2], 255]).hsl(); // 45

                let minBrightness = hslReferenceColor.lightness() + this.differenceBrightness; // 55
                let minDarkness = hslReferenceColor.lightness() - this.differenceDarkness; // 35

                if (this.differenceBrightness &&
                    minBrightness > hslColor.lightness() &&
                    (0 == this.differenceDarkness || hslReferenceColor.lightness() < hslColor.lightness())
                ) {
                    hslColor = hslColor.lightness(minBrightness);
                }

                if (this.differenceDarkness &&
                    minDarkness < hslColor.lightness() &&
                    (0 == this.differenceBrightness || hslReferenceColor.lightness() > hslColor.lightness())
                ) {
                    hslColor = hslColor.lightness(minDarkness);
                }

                let rgbColor = hslColor.rgb();

                callback(err, [rgbColor.red() * 255, rgbColor.green() * 255, rgbColor.blue() * 255]);
            });
        });
    }
}
