import { INode, parseSync, stringify } from 'svgson';

/**
 * @deprecated
 */
export default class Parser {
  public static parse(svg: string | INode) {
    return typeof svg === 'string' ? parseSync(svg) : svg;
  }

  public static stringify(svg: string | INode) {
    return typeof svg === 'string' ? svg : stringify(svg);
  }
}
