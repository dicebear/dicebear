import ColorInterface from './color';
import { createImage, createCanvas } from './helper/canvas';

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
    protected image: HTMLImageElement = null;
    protected imageError: Error = null;
    protected imageSprites: number = null;

    constructor(options: SpriteOptions) {
        // Set default options
        options.size = options.size || 20;
        options.chance = options.chance || 100;

        this.options = options;
    }

    load(callback: (err: Error|null, image: HTMLImageElement|null) => void) {
        if (null === this.image) {
            // Create HTMLImageElement
            this.image = createImage();

            this.image.addEventListener('load', () => {
                this.imageSprites = Math.floor(this.image.width / this.options.size)
            });

            this.image.addEventListener('error', err => {
                this.imageError = err.error;
            });
        }

        if (this.image.src && this.image.complete) {
            process.nextTick(() => callback(this.imageError, this.image));
        } else {
            this.image.addEventListener('load', () => {
                callback(null, this.image);
            });

            this.image.addEventListener('error', err => {
                callback(err.error, this.image);
            });
        }

        if (!this.image.src) {
            this.image.src = this.options.src;
        }
    }

    create(chance: Chance.Chance, callback: (err: Error|null, image: HTMLImageElement|null) => void) {
        if (!this.image.complete) {
            process.nextTick(() => callback(new Error('Sprite image not loaded.'), null));

            return;
        }

        var canvas = createCanvas();
        var context = canvas.getContext('2d');

        canvas.width = this.options.size;
        canvas.height = this.options.size;

        if (chance.bool({likelihood: this.options.chance})) {
            context.drawImage(
                this.image,
                chance.natural({min: 0, max: this.imageSprites - 1}) * this.options.size * -1,
                0
            );

            let color = this.options.color.getColor(chance);
            let buffer = context.getImageData(0, 0, canvas.width, canvas.height);

            for(let i = 0; i < buffer.data.length; i += 4) {
                let r = i;
                let g = i + 1;
                let b = i + 2;
                let a = i + 3;

                if (a > 0) {
                    buffer.data[r] = Math.round((buffer.data[r]-color[0])*(buffer.data[r]/255)+color[0]);
                    buffer.data[g] = Math.round((buffer.data[g]-color[1])*(buffer.data[g]/255)+color[1]);
                    buffer.data[b] = Math.round((buffer.data[b]-color[2])*(buffer.data[b]/255)+color[2]);
                }
            }

            context.putImageData(buffer, 0, 0);
        }

        var sprite = createImage();

        sprite.addEventListener('load', () => {
            callback(null, sprite);
        });

        sprite.addEventListener('error', err => {
            callback(err.error, sprite);
        });

        sprite.src = canvas.toDataURL('image/png');
    }
}
