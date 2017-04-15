import { RgbInterface } from './helper/color';

export interface ColorInterface {
    getColor(chance: Chance.Chance, callback: (err, color: RgbInterface) => void);
}

export default class Color implements ColorInterface {
    private colors: RgbInterface[];
    private pickedColors: { [key: number]: RgbInterface } = {};

    constructor(colors: RgbInterface[]) {
        this.colors = colors;
    }

    getColor(chance: Chance.Chance, callback: (err, color: RgbInterface) => void) {
        process.nextTick(() => {
            this.pickedColors[chance.seed] = this.pickedColors[chance.seed] || chance.pickone(this.colors);

            callback(null, this.pickedColors[chance.seed]);
        });
    }
}
