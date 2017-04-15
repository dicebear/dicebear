import { RgbInterface, HslInterface } from '../../helper/color';
import { ColorInterface } from '../../color';
import Color from '../../color';
import * as OneColor from 'onecolor';

export default class DarkerThan extends Color {
    private referenceColor: ColorInterface;
    private difference: number;

    constructor(colors: RgbInterface[], referenceColor: ColorInterface, difference: number) {
        super(colors);

        this.referenceColor = referenceColor;
        this.difference = difference;
    }

    getColor(chance: Chance.Chance, callback: (err, color: RgbInterface) => void) {
        super.getColor(chance, (err, color) => {
            this.referenceColor.getColor(chance, (err, referenceColor) => {
                let hslColor = new OneColor.color([color[0], color[1], color[2], 255]).hsl();
                let hslReferenceColor = new OneColor.color([referenceColor[0], referenceColor[1], referenceColor[2], 255]).hsl();

                if (hslReferenceColor.lightness() - this.difference < hslColor.lightness()) {
                    hslColor = hslColor.lightness(hslReferenceColor.lightness() - this.difference);
                }

                let rgbColor = hslColor.rgb();

                callback(err, [rgbColor.red() * 255, rgbColor.green() * 255, rgbColor.blue() * 255]);
            });
        });
    }
}
