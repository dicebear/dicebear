export default class Color {
    rgb: [number, number, number];
    constructor(color: string | [number, number, number]);
    /**
     * Get color hsl value
     */
    /**
     * Set color hsl value and calculate rgb
     */
    hsl: [number, number, number];
    /**
     * Set color hex value and calculate rgb
     */
    hex: string;
    /**
     * Create new color object with same rgb value
     */
    clone(): Color;
}
