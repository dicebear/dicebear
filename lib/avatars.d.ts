import Avatar from './model/avatar';
import { SpriteSetInterface } from './spriteSet';
import Random from './helper/random';
export default class Avatars {
    static SPRITE_SETS: {
        male: SpriteSetInterface;
        female: SpriteSetInterface;
        identicon: SpriteSetInterface;
    };
    protected spriteSet: SpriteSetInterface;
    /**
     * @param spriteSet
     * @param options
     */
    constructor(spriteSet: SpriteSetInterface);
    /**
     * Creates an avatar
     *
     * @param seed
     * @param options
     */
    create(seed: string | Random): Promise<Avatar>;
}
