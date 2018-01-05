import { createCanvas } from '../helper/canvas';

export default class Avatar {
  public readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  resize(size: number) {
    let canvas = createCanvas();

    canvas.width = size;
    canvas.height = size;

    let context = canvas.getContext('2d');

    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.oImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;

    context.drawImage(this.canvas, 0, 0, size, size);

    return new Avatar(canvas);
  }

  get dataUrl() {
    return this.canvas.toDataURL();
  }
}
