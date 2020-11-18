import { parseSync, stringify } from 'svgson';

export default class Parser {
  public static parse(svg: string | svgson.schema) {
    return typeof svg === 'string' ? parseSync(svg) : svg;
  }

  public static stringify(svg: string | svgson.schema) {
    return typeof svg === 'string' ? svg : stringify(svg);
  }
}
