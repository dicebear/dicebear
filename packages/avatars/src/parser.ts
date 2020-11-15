import { INode, parseSync, stringify } from 'svgson';

/**
 * @deprecated Since version 4.5. Will be removed in version 5.0.
 */
export default class Parser {
  public static parse(svg: string | INode) {
    return typeof svg === 'string' ? parseSync(svg) : svg;
  }

  public static stringify(svg: string | INode) {
    return typeof svg === 'string' ? svg : stringify(svg);
  }
}
