import ColorInterface from './colorInterface';
import * as process from 'process';
import { pickone } from './helper/chance';

class Color implements ColorInterface {
    private color;

    constructor(colors) {
        this.color = pickone(colors);
    }

    public getColor(callback) {
        process.nextTick(() => {
            callback(undefined, this.color);
        });
    }
}
