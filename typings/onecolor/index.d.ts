declare function one(
  color: string | [number, number, number, number] | [string, number, number, number, number]
): one.Color;

declare namespace one {
  interface ExporterInterface {
    hex(): string;
    css(): string;
    cssa(): string;
    toString(): string;
    toJSON(): [string, number, number, number, number];
  }

  interface ConverterInterface {
    rgb(): RgbInterface;
    hsl(): HslInterface;
    hsv(): HsvInterface;
  }

  interface RgbInterface extends ConverterInterface, ExporterInterface {
    red(): number;
    red(red: number, newInstance?: boolean): RgbInterface;

    green(): number;
    green(green: number, newInstance?: boolean): RgbInterface;

    blue(): number;
    blue(blue: number, newInstance?: boolean): RgbInterface;

    alpha(): number;
    alpha(alpha: number, newInstance?: boolean): RgbInterface;
  }

  interface HslInterface extends ConverterInterface, ExporterInterface {
    hue(): number;
    hue(hue: number, newInstance?: boolean): HslInterface;

    saturation(): number;
    saturation(saturation: number, newInstance?: boolean): HslInterface;

    lightness(): number;
    lightness(lightness: number, newInstance?: boolean): HslInterface;

    alpha(): number;
    alpha(alpha: number, newInstance?: boolean): HslInterface;
  }

  interface HsvInterface extends ConverterInterface, ExporterInterface {
    hue(): number;
    hue(hue: number, newInstance?: boolean): HsvInterface;

    saturation(): number;
    saturation(saturation: number, newInstance?: boolean): HsvInterface;

    value(): number;
    value(value: number, newInstance?: boolean): HsvInterface;

    alpha(): number;
    alpha(alpha: number, newInstance?: boolean): HsvInterface;
  }

  interface Color extends ConverterInterface, ExporterInterface {
    equals(otherColor: Color, epsilon?: number): boolean;
  }
}

declare module 'onecolor/minimal' {
  export = one;
}
