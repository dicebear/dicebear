import { SpriteSetInterface } from './spriteSet';
import { createCanvas } from './helper/canvas';
import * as objectAssign from 'object-assign';
import * as async from 'async';
import { Chance } from 'chance';

export interface AvatarsOptions {
    size?: number,
    order?: string[]
}

export default class Avatars {
    protected spriteSet: SpriteSetInterface;
    protected options: AvatarsOptions;
    
    public constructor(spriteSet: SpriteSetInterface, options: AvatarsOptions = {}) {
        this.spriteSet = spriteSet;
    }

    public create(token: string|number, callback: (err, image: HTMLImageElement) => void, options: AvatarsOptions = {}) {
        async.each(this.spriteSet, (sprite, next) => {
            sprite.load(next);
        }, err => {
            if (err) {
                callback(err, null);

                return;
            }

            let avatarOptions = objectAssign({
                size: 20,
                order: Object.keys(this.spriteSet)
            }, this.options, options);

            let chance = new Chance(<any>token);

            let canvas = createCanvas();
            let context = canvas.getContext('2d');

            canvas.width = avatarOptions.size;
            canvas.height = avatarOptions.size;

            // Disable image smoothing
            context.imageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.oImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;

            async.eachSeries(avatarOptions.order, (spriteName, next) => {
                let sprite = this.spriteSet[spriteName];

                if (sprite) {
                    sprite.create(chance, (err, image) => {
                        if (err) {
                            next(err);

                            return;
                        }

                        context.drawImage(image, 0, 0, canvas.width, canvas.height);

                        next();
                    });
                } else {
                    next(new Error('Sprite '+spriteName+' does not exist.'));
                }
            }, err => {
                if (err) {
                    callback(err, null);
                }

                let image = new Image;

                image.addEventListener('load', () => {
                    callback(null, image);
                });

                image.addEventListener('error', err => {
                    callback(err.error, image);
                })

                image.src = canvas.toDataURL('image/png');
            });
        });
    }
}
