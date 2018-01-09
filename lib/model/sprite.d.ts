import ColorSet from './colorSet';
import Random from '../helper/random';
export interface SpriteOptions {
    src: string;
    colorSet: ColorSet;
    chance?: number;
}
export default class Sprite {
    protected options: SpriteOptions;
    protected image: HTMLImageElement;
    protected imageError: Error;
    protected imageSprites: number;
    /**
     * @param options
     */
    constructor(options: SpriteOptions);
    /**
     * Loads sprite Image
     */
    load(): Promise<HTMLImageElement>;
    /**
     * Creates an sprite
     *
     * @param random
     */
    create(random: Random): HTMLCanvasElement;
    /**
     * Tints an sprite
     *
     * @param canvas
     * @param color
     */
    private tintCanvas(canvas, color);
}
