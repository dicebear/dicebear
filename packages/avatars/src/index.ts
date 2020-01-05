import Random from './random';
import Color from './color';
import Parser from './parser';

export type Options = {
  radius?: number;
  base64?: boolean;
  width?: number | string;
  height?: number | string;
  margin?: number;
  background?: string;
};

export type SpriteCollection<O = {}> = (random: Random, options?: O) => string | svgson.schema;

export default class Avatars<O> {
  public static random = Random;
  public static color = Color;

  protected spriteCollection: SpriteCollection<O>;
  protected defaultOptions?: O & Options;

  /**
   * @param spriteCollection
   */
  constructor(spriteCollection: SpriteCollection<O>, defaultOptions?: O & Options) {
    this.spriteCollection = spriteCollection;
    this.defaultOptions = defaultOptions;
  }

  /**
   * Creates an avatar
   *
   * @param seed
   */
  public create(seed: string, options?: O & Options) {
    options = { ...(this.defaultOptions || {}), ...options };

    let svg = this.spriteCollection(new Random(seed), options);

    if (options) {
      svg = Parser.parse(svg);

      let viewPort = svg.attributes['viewport'].split(' ');
      let viewPortWidth = parseInt(viewPort[3]);
      let viewPortHeight = parseInt(viewPort[4]);

      if (options.width) {
        svg.attributes['width'] = options.width.toString();
      }

      if (options.height) {
        svg.attributes['height'] = options.height.toString();
      }

      if (options.margin) {
        let groupable: svgson.schema[] = [];

        svg.children = svg.children.filter(child => {
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
                    width: viewPortWidth.toString(),
                    height: viewPortHeight.toString()
                  }
                },
                ...groupable
              ],
              attributes: {
                transform: `translate(${(viewPortWidth * options.margin) / 100}, ${(viewPortHeight * options.margin) /
                  100})`
              }
            }
          ],
          attributes: {
            transform: `scale(${options.margin / 100})`
          }
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
            width: viewPortWidth.toString(),
            height: viewPortHeight.toString()
          }
        });
      }

      if (options.radius) {
        let groupable: svgson.schema[] = [];

        svg.children = svg.children.filter(child => {
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
                  width: viewPortWidth.toString(),
                  height: viewPortHeight.toString(),
                  rx: ((viewPortWidth / 100) * options.radius).toString(),
                  ry: ((viewPortHeight / 100) * options.radius).toString()
                }
              }
            ],
            attributes: {
              id: 'avatarsRadiusMask'
            }
          },
          {
            name: 'g',
            type: 'element',
            value: '',
            children: groupable,
            attributes: {
              mask: `url(#avatarsRadiusMask)`
            }
          }
        );
      }
    }

    svg = Parser.stringify(svg);

    return options && options.base64 ? `data:image/svg+xml;base64,${window.btoa(svg)}` : svg;
  }

  private isGroupable(element: svgson.schema) {
    return element.type === 'element' && ['title', 'desc', 'defs', 'metadata'].indexOf(element.name) !== -1;
  }
}
