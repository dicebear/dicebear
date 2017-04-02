import Canvas from 'canvas';

export function createCanvas() : HTMLCanvasElement {
    return new Canvas();
}

export function createImage() : HTMLImageElement {
    return new Canvas.Image();
}
