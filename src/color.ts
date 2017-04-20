import { RgbInterface } from './helper/color';

export interface ColorInterface {
    getColor(chance: Chance.Chance, callback: (err, color: RgbInterface) => void);
}

export default class Color implements ColorInterface {
    private colors: RgbInterface[]|ColorInterface;
    private pickedColors: { [key: number]: RgbInterface } = {};

    /**
     * @param colors
     */
    constructor(colors: RgbInterface[]|ColorInterface) {
        this.colors = colors;
    }

    /**
     * Returns a color
     * 
     * @param chance
     * @param callback
     */
    getColor(chance: Chance.Chance, callback: (err, color: RgbInterface) => void) {
        if (this.colors instanceof Array) {
            process.nextTick(() => {
                this.pickedColors[chance.seed] = this.pickedColors[chance.seed] || chance.pickone(<RgbInterface[]>this.colors);

                callback(null, this.pickedColors[chance.seed]);
            });
        } else {
            this.colors.getColor(chance, callback);
        }
    }
}
