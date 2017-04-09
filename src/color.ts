export interface ColorInterface {
    getColor(chance: Chance.Chance): [number, number, number];
}

export default class Color implements ColorInterface {
    private colors: [number, number, number][];

    constructor(colors: [number, number, number][]) {
        this.colors = colors;
    }

    getColor(chance: Chance.Chance): [number, number, number] {
        return chance.pickone(this.colors);
    }
}
