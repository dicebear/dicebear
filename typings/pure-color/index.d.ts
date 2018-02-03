declare namespace pureColor {
  namespace parse {
    interface hex {
      (hex: string): number[];
    }
  }

  namespace convert {
    interface rgb2hsv {
      (rgb: number[]): number[];
    }

    interface rgb2hex {
      (rgb: number[]): string;
    }

    interface hsv2rgb {
      (rgb: number[]): number[];
    }
  }
}

declare module 'pure-color/parse/hex' {
  var hex: pureColor.parse.hex;

  export = hex;
}

declare module 'pure-color/convert/rgb2hsv' {
  var rgb2hsv: pureColor.convert.rgb2hsv;

  export = rgb2hsv;
}

declare module 'pure-color/convert/rgb2hex' {
  var rgb2hex: pureColor.convert.rgb2hex;

  export = rgb2hex;
}

declare module 'pure-color/convert/hsv2rgb' {
  var hsv2rgb: pureColor.convert.hsv2rgb;

  export = hsv2rgb;
}
