import { SpriteSetInterface } from './spriteSet';

export class Avatars {
    protected spriteSet: SpriteSetInterface;
    
    public constructor(spriteSet: SpriteSetInterface) {
        this.spriteSet = spriteSet;
    }

    public create(callback: (err, stream: ReadableStream) => void) {

    }
}
