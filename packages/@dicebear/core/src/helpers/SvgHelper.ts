import { Prng } from '../Prng.js';
import { ColorModel } from '../models/ColorModel.js';
import { ViewBox } from '../types.js';

export class SvgHelper {
  static escape(content: string): string {
    return content.replace(
      /[&'"><]/g,
      (match) =>
        ({
          '&': '&amp;',
          "'": '&apos;',
          '"': '&quot;',
          '>': '&gt;',
          '<': '&lt;',
        })[match] as string,
    );
  }

  static createAttrString(attributes: Array<[string, unknown]>): string {
    return attributes
      .map(
        ([name, value]) =>
          `${SvgHelper.escape(name)}="${SvgHelper.escape(value as string)}"`,
      )
      .join(' ');
  }

  static addBackground(
    body: string,
    viewBox: ViewBox,
    backgroundColor: ColorModel,
  ): string {
    const { width, height } = viewBox;

    return `<rect fill="rgba(${backgroundColor.getRgba().join(', ')})" width="${width}" height="${height}" />${body}`;
  }

  static addScale(body: string, viewBox: ViewBox, scale: number): string {
    const { width, height } = viewBox;

    const percent = (scale - 100) / 100;
    const translateX = (width / 2) * percent * -1;
    const translateY = (height / 2) * percent * -1;

    return `<g transform="translate(${translateX} ${translateY}) scale(${
      scale / 100
    })">${body}</g>`;
  }

  static addTranslate(
    body: string,
    viewBox: ViewBox,
    translateX: number,
    translateY: number,
  ): string {
    const { width, height } = viewBox;

    const x = translateX ? (width * translateX) / 100 : 0;
    const y = translateY ? (height * translateY) / 100 : 0;

    if (!x && !y) {
      return body;
    }

    return `<g transform="translate(${x} ${y})">${body}</g>`;
  }

  static addRotate(body: string, viewBox: ViewBox, rotate: number): string {
    const { width, height } = viewBox;

    return `<g transform="rotate(${rotate} ${width / 2} ${height / 2})">${body}</g>`;
  }

  static addFlip(body: string, viewBox: ViewBox): string {
    const { width } = viewBox;

    return `<g transform="scale(-1 1) translate(${width * -1} 0)">${body}</g>`;
  }

  static addRadius(body: string, viewBox: ViewBox, radius: number): string {
    const { width, height } = viewBox;

    const rx = radius ? (width * radius) / 100 : 0;
    const ry = radius ? (height * radius) / 100 : 0;

    return (
      `<mask id="viewboxMask">` +
      `<rect width="${width}" height="${height}" rx="${rx}" ry="${ry}" fill="#fff" />` +
      `</mask>` +
      `<g mask="url(#viewboxMask)">${body}</g>`
    );
  }

  static randomizeIds(body: string): string {
    const prng = new Prng();
    const ids: Record<string, string> = {};

    return body.replace(
      /(id="|url\(#)([a-z0-9-_]+)([")])/gi,
      (match, m1, m2, m3) => {
        ids[m2] = ids[m2] || prng.string(8);

        return `${m1}${ids[m2]}${m3}`;
      },
    );
  }

  static replacePlaceholders(
    body: string,
    placeholders: Array<[string, unknown]>,
  ): string {
    return body.replace(/\{\{([^}]+)\}\}/gi, (match, m1) => {
      const value = placeholders.find(([key]) => key === m1)?.[1];

      if (typeof value === 'string') {
        return SvgHelper.escape(value);
      }

      return '';
    });
  }
}
