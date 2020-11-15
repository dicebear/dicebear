import type { INode } from 'svgson';
import type { Prng } from './types';
import { prng } from './utils';
import Parser from './Parser';
import { utils } from '.';
import { version } from '../package.json';

export type Options = {
  radius?: number;
  r?: number;
  base64?: boolean;
  width?: number | string;
  w?: number | string;
  height?: number | string;
  h?: number | string;
  margin?: number;
  m?: number;
  background?: string;
  b?: number;
  /**
   * @deprecated Since version 4.5. Will be removed in version 5.0.
   */
  userAgent?: string;
};

export interface AvatarStyle<O = {}> {
  requiredCoreVersion?: string;
  (random: Prng, options?: O): string | INode;
}

/**
 * @deprecated Since version 4.5. Will be removed in version 5.0. Use `createAvatar` instead.
 */
export default class Avatars<O> {
  protected avatarStyle: AvatarStyle<O>;
  protected defaultOptions?: O & Options;

  /**
   * @param avatarStyle
   */
  constructor(avatarStyle: AvatarStyle<O>, defaultOptions?: O & Options) {
    if (avatarStyle.requiredCoreVersion) {
      if (false === utils.semver.gte(version, avatarStyle.requiredCoreVersion)) {
        console.error(
          `This avatar style requires a newer version of the core library. Installed is version ${version}, required is version ${avatarStyle.requiredCoreVersion}.`
        );
      }
    } else {
      console.warn('This avatar style does not specify the required version of the core library. Problems may occur.');
    }

    this.avatarStyle = avatarStyle;
    this.defaultOptions = {
      userAgent: typeof window !== 'undefined' && window.navigator && window.navigator.userAgent,
      ...defaultOptions,
    };
  }

  /**
   * Creates an avatar
   *
   * @param seed
   */
  public create(seed: string, options?: O & Options) {
    options = { ...this.defaultOptions, ...options };

    // Apply alias options
    options = {
      radius: options.r,
      width: options.w,
      height: options.h,
      margin: options.m,
      background: options.b,
      ...options,
    };

    let svg = this.avatarStyle(prng.create(seed), options);

    if (options) {
      svg = Parser.parse(svg);

      let viewBox = svg.attributes['viewBox'].split(' ');
      let viewBoxX = parseInt(viewBox[0]);
      let viewBoxY = parseInt(viewBox[1]);
      let viewBoxWidth = parseInt(viewBox[2]);
      let viewBoxHeight = parseInt(viewBox[3]);

      if (options.width) {
        svg.attributes['width'] = options.width.toString();
      }

      if (options.height) {
        svg.attributes['height'] = options.height.toString();
      }

      if (options.margin) {
        let groupable: INode[] = [];

        svg.children = svg.children.filter((child) => {
          if (this.isGroupable(child)) {
            groupable.push(child);

            return false;
          }

          return true;
        });

        svg.children.push({
          name: 'g',
          type: 'element',
          value: '',
          children: [
            {
              name: 'g',
              type: 'element',
              value: '',
              children: [
                {
                  name: 'rect',
                  type: 'element',
                  value: '',
                  children: [],
                  attributes: {
                    fill: 'none',
                    width: viewBoxWidth.toString(),
                    height: viewBoxHeight.toString(),
                    x: viewBoxX.toString(),
                    y: viewBoxY.toString(),
                  },
                },
                ...groupable,
              ],
              attributes: {
                transform: `scale(${1 - (options.margin * 2) / 100})`,
              },
            },
          ],
          attributes: {
            // prettier-ignore
            transform: `translate(${viewBoxWidth * options.margin / 100}, ${viewBoxHeight * options.margin / 100})`,
          },
        });
      }

      if (options.background) {
        svg.children.unshift({
          name: 'rect',
          type: 'element',
          value: '',
          children: [],
          attributes: {
            fill: options.background,
            width: viewBoxWidth.toString(),
            height: viewBoxHeight.toString(),
            x: viewBoxX.toString(),
            y: viewBoxY.toString(),
          },
        });
      }

      if (options.radius) {
        let groupable: INode[] = [];

        svg.children = svg.children.filter((child) => {
          if (this.isGroupable(child)) {
            groupable.push(child);

            return false;
          }

          return true;
        });

        svg.children.push(
          {
            name: 'mask',
            type: 'element',
            value: '',
            children: [
              {
                name: 'rect',
                type: 'element',
                value: '',
                children: [],
                attributes: {
                  width: viewBoxWidth.toString(),
                  height: viewBoxHeight.toString(),
                  rx: ((viewBoxWidth * options.radius) / 100).toString(),
                  ry: ((viewBoxHeight * options.radius) / 100).toString(),
                  fill: '#fff',
                  x: viewBoxX.toString(),
                  y: viewBoxY.toString(),
                },
              },
            ],
            attributes: {
              id: 'avatarsRadiusMask',
            },
          },
          {
            name: 'g',
            type: 'element',
            value: '',
            children: groupable,
            attributes: {
              mask: `url(#avatarsRadiusMask)`,
            },
          }
        );
      }
    }

    svg = Parser.stringify(svg);

    return options && options.base64 ? `data:image/svg+xml;base64,${this.base64EncodeUnicode(svg)}` : svg;
  }

  private isGroupable(element: INode) {
    return element.type === 'element' && ['title', 'desc', 'defs', 'metadata'].indexOf(element.name) === -1;
  }

  private base64EncodeUnicode(value: string) {
    // @see https://www.base64encoder.io/javascript/
    let utf8Bytes = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(`0x${p1}`));
    });

    return btoa(utf8Bytes);
  }
}

export function createAvatar<O>(style: AvatarStyle<O>, options: O & Options & { seed: string }) {
  return new Avatars(style, options).create(options.seed);
}
