export default class Avatar {
    readonly canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement);
    resize(size: number): Avatar;
    readonly dataUrl: string;
}
