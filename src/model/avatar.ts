export default class Avatar {
  public readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  get dataUrl() {
    return this.canvas.toDataURL();
  }
}
