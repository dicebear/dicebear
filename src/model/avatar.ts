import { createCanvas } from '../helper/canvas';

/**
 * Possible avatar export options
 */
export interface AvatarExportOptions {
  size?: number;
  background?: string;
}

/**
 * Generated Avatar
 *
 * Contains export methods for formats supported by `node-canvas`.
 */
export default class Avatar {
  public readonly canvas: HTMLCanvasElement;

  /**
   * Constructor
   *
   * @param canvas
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  /**
   * Exports the avatar as PNG data url
   *
   * @param options
   */
  getPNG(options: AvatarExportOptions = {}) {
    return this.getDataUrl('image/png', options);
  }

  /**
   * Exports the avatar as JPEG data url
   *
   * @param options
   */
  getJPEG(options: AvatarExportOptions = {}) {
    return this.getDataUrl('image/jpeg', options);
  }

  /**
   * Exports the avatar as GIF data url
   *
   * @param options
   */
  getGIF(options: AvatarExportOptions = {}) {
    return this.getDataUrl('image/gif', options);
  }

  /**
   * Exports the avatar as SVG data url
   *
   * @param options
   */
  getSVG(options: AvatarExportOptions = {}) {
    return this.getDataUrl('image/svg+xml', options);
  }

  /**
   * Exports the avatar in various formats as data url
   *
   * @param format
   * @param options
   */
  getDataUrl(format: string, options: AvatarExportOptions) {
    let canvas = this.canvas;

    if (options.background) {
      canvas = this.tintBackground(canvas, options.background);
    }

    if (options.size) {
      canvas = this.resize(canvas, options.size);
    }

    return this.canvas.toDataURL(format);
  }

  /**
   * Resizes the avatar and returns the new canvas
   *
   * @param canvas
   * @param size
   */
  private resize(canvas: HTMLCanvasElement, size: number) {
    let newCanvas = createCanvas();

    newCanvas.width = size;
    newCanvas.height = size;

    let context = newCanvas.getContext('2d');

    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.oImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;

    context.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    return newCanvas;
  }

  /**
   * Sets a background color and returns the new canvas
   *
   * @param canvas
   * @param color
   */
  private tintBackground(canvas: HTMLCanvasElement, color: string) {
    let newCanvas = createCanvas();

    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    let context = newCanvas.getContext('2d');

    context.beginPath();
    context.rect(0, 0, newCanvas.width, newCanvas.height);
    context.fillStyle = color;
    context.fill();

    context.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    return newCanvas;
  }
}
