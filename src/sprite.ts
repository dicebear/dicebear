import ColorInterface from './color';
import { createImage } from './helper/canvas';

export interface SpriteInterface {
    load(callback: (err: Error|null, image: HTMLImageElement|null) => void);
    create(chance: Chance.Chance, callback: (err: Error|null, image: HTMLImageElement|null) => void);
}

interface SpriteOptions {
    src: string,
    color: ColorInterface,
    size?: number,
    chance?: number
}

export default class Sprite implements SpriteInterface {
    protected options: SpriteOptions;
    protected image: HTMLImageElement;

    constructor(options: SpriteOptions) {
        // Set default options
        options.size = options.size || 20;
        options.chance = options.chance || 100;

        this.options = options;

        // Create HTMLImageElement
        this.image = createImage();
        this.image.src = options.src;
    }

    load(callback: (err: Error|null, image: HTMLImageElement|null) => void) {
        if (this.image.complete) {
            process.nextTick(() => callback(null, this.image));
        } else {
            this.image.onload = () => callback(null, this.image);
            this.image.onerror = (err) => callback(new Error(err.message), null);
        }
    }

    create(chance: Chance.Chance, callback: (err: Error|null, image: HTMLImageElement|null) => void) {
        if (false === this.image.complete) {
            callback(new Error('Sprite Image not loaded.'), null);
        }
    }
}