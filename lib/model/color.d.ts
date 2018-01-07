/// <reference types="onecolor" />
import * as oneColor from 'onecolor/minimal';
export default class Color {
    private color;
    constructor(color: string);
    rgb(): oneColor.RgbInterface;
    hsl(): oneColor.HslInterface;
    clone(): Color;
}
