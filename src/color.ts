export interface ColorInterface {
    create(chance: Chance.Chance, callback: (err, color) => void);
}

export default class Color implements ColorInterface {
    private colors: [number, number, number][];

    constructor(colors: [number, number, number][]) {
        this.colors = colors;
    }

    create(chance: Chance.Chance, callback) {
        let color = chance.pickone(this.colors);

        process.nextTick(() => callback(undefined, color));
    }
}
