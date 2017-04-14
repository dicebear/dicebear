export interface ColorInterface {
    getColor(chance: Chance.Chance): [number, number, number];
}

export default class Color implements ColorInterface {
    private colors: [number, number, number][];
    private pickedColors: { [key: number]: [number, number, number] };

    constructor(colors: [number, number, number][]) {
        this.colors = colors;
    }

    getColor(chance: Chance.Chance): [number, number, number] {
        return this.pickedColors[chance.seed] = this.pickedColors[chance.seed] || chance.pickone(this.colors);
    }
}
