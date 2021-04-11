import type { INode } from 'svgson';
import Random from './random';
import Color from './color';
import Parser from './parser';
import type { Options } from './options';
import { Style, StyleCreateResultAttributes } from './types';
import { createAvatar } from './core';

/**
 * @deprecated use `Style` type instead.
 */
export type SpriteCollection<O = {}> = (random: Random, options?: O & Options) => string | INode;

/**
 * @deprecated use `createAvatar` function instead.
 */
export default class Avatars<O extends {}> {
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
  public create(seed?: string, options?: O & Options) {
    const style: Style<O> = {
        meta: {},
        schema: {},
        create: ({ prng, options: styleOptions }) => {
            let svg = Parser.parse(this.spriteCollection(new Random(prng.seed), styleOptions as O));
            let head: INode[] = [];
            let body: INode[] = [];

            svg.children.forEach((child) => {
                if (this.isBody(child)) {
                    body.push(child);
                } else {
                    head.push(child);
                }
            });

            return {
                attributes: svg.attributes as StyleCreateResultAttributes,
                head: head.map(v => Parser.stringify(v)).join(''),
                body: body.map(v => Parser.stringify(v)).join('')
            }
        }
    }

    // @ts-ignore
    return createAvatar(style, { ...this.defaultOptions, ...options, seed });
  }

  private isBody(element: INode) {
    return element.type === 'element' && ['title', 'desc', 'defs', 'metadata'].indexOf(element.name) === -1;
  }
}
