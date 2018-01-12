import Color from './color';
import ColorSet from './colorSet';
import { createImage, createCanvas } from '../helper/canvas';
import Random from '../helper/random';

export interface SpriteOptions {
  src: string;
  colorSet: ColorSet;
  chance?: number;
}

export default class Sprite {
  protected options: SpriteOptions;
  protected image: HTMLImageElement = null;
  protected imageError: Error = null;
  protected imageSprites: number = null;

  /**
   * @param options
   */
  constructor(options: SpriteOptions) {
    // Set default options
    options.chance = options.chance || 100;

    this.options = options;
  }

  /**
   * Loads sprite Image
   */
  load(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (null === this.image) {
        // Create HTMLImageElement
        this.image = createImage();

        this.image.addEventListener('load', () => {
          this.imageSprites = Math.floor(this.image.width / this.image.height);
        });

        this.image.addEventListener('error', err => {
          this.imageError = err.error;
        });
      }

      if (this.image.src && this.image.complete) {
        this.imageError ? reject(this.imageError) : resolve(this.image);
      } else {
        this.image.addEventListener('load', () => resolve(this.image));
        this.image.addEventListener('error', err => reject(err.error));

        this.image.src = this.options.src;
      }
    });
  }

  /**
   * Creates an sprite
   *
   * @param random
   */
  create(random: Random): HTMLCanvasElement {
    if (!this.image.complete) {
      throw new Error('Sprite image not loaded.');
    }

    var canvas = createCanvas();
    var context = canvas.getContext('2d');

    canvas.width = this.image.height;
    canvas.height = this.image.height;

    if (random.bool(this.options.chance)) {
      let color = this.options.colorSet.getColor(random);

      context.drawImage(this.image, random.integer(0, this.imageSprites - 1) * this.image.height * -1, 0);

      this.tintCanvas(canvas, color);

      return canvas;
    } else {
      return canvas;
    }
  }

  /**
   * Tints an sprite
   *
   * @param canvas
   * @param color
   */
  private tintCanvas(canvas: HTMLCanvasElement, color: Color) {
    let context = canvas.getContext('2d');
    let buffer = context.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < buffer.data.length; i += 4) {
      let r = i;
      let g = i + 1;
      let b = i + 2;
      let a = i + 3;

      if (a > 0) {
        buffer.data[r] = Math.round((buffer.data[r] - color.rgb[0]) * (buffer.data[r] / 255) + color.rgb[0]);

        buffer.data[g] = Math.round((buffer.data[g] - color.rgb[1]) * (buffer.data[g] / 255) + color.rgb[1]);

        buffer.data[b] = Math.round((buffer.data[b] - color.rgb[2]) * (buffer.data[b] / 255) + color.rgb[2]);
      }
    }

    context.putImageData(buffer, 0, 0);
  }
}
