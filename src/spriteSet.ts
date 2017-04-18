import { SpriteInterface } from './sprite';

export interface SpriteSetInterface {
    (chance: Chance.Chance, callback: (err: Error, spriteSet: { [key: string]: SpriteInterface }) => void): void;
}
