declare namespace svgson {
  interface schema {
    name: string;
    type: string;
    value: string;
    children: svgson.schema[];
    attributes: {
      [key: string]: string;
    };
  }
}

declare module 'svgson' {
  export function parse(svg: string): Promise<svgson.schema>;
  export function parseSync(svg: string): svgson.schema;
  export function stringify(svg: svgson.schema): string;
}
