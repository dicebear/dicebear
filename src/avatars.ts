import { SpriteSetInterface } from './spriteSet';
import { createCanvas, createImage } from './helper/canvas';
import * as objectAssign from 'object-assign';
import * as async from 'async';
import { Chance } from 'chance';

import maleSpriteSet from './spriteSets/male';
import femaleSpriteSet from './spriteSets/female';

export interface AvatarsOptions {
    size?: number,
    order?: string[]
}

export default class Avatars {
    public static SPRITE_SETS = {
        male: maleSpriteSet,
        female: femaleSpriteSet
    };

    protected spriteSet: SpriteSetInterface;
    protected options: AvatarsOptions;

    /**
     * @param spriteSet 
     * @param options 
     */
    public constructor(spriteSet: SpriteSetInterface, options: AvatarsOptions = {}) {
        this.spriteSet = spriteSet;
        this.options = options;
    }

    /**
     * Creates an avatar
     * 
     * @param token
     * @param options
     * @param callback
     */
    public create(
        token: string|number|Chance.Chance,
        options: AvatarsOptions,
        callback: (err, canvas: HTMLCanvasElement, chance: Chance.Chance) => void
    ) {
        let chance = ['string', 'number'].indexOf(typeof token) > -1 ? new Chance(<string|number>token) : <Chance.Chance>token;

        this.spriteSet(chance, (err, spriteSet) => {
            async.each(spriteSet, (sprite, next) => {
                sprite.load(next);
            }, err => {
                if (err) {
                    callback(err, null, chance);

                    return;
                }

                let avatarOptions = objectAssign({
                    size: 20,
                    order: Object.keys(spriteSet)
                }, this.options, options);

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
                    let sprite = spriteSet[spriteName];

                    if (sprite) {
                        sprite.create(chance, (err, spriteCanvas) => {
                            if (err) {
                                next(err);

                                return;
                            }

                            context.drawImage(spriteCanvas, 0, 0, canvas.width, canvas.height);

                            next();
                        });
                    } else {
                        next(new Error('Sprite '+spriteName+' does not exist.'));
                    }
                }, err => {
                    callback(err, canvas, chance);
                });
            });
        });
    }
}
