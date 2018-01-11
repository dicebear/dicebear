/**
 * Possible avatar export options
 */
export interface AvatarExportOptions {
    size?: number;
    background?: string;
}
/**
 * Generated Avatar
 *
 * Contains export methods for formats supported by `node-canvas`.
 */
export default class Avatar {
    readonly canvas: HTMLCanvasElement;
    /**
     * Constructor
     *
     * @param canvas
     */
    constructor(canvas: HTMLCanvasElement);
    /**
     * Exports the avatar as PNG data url
     *
     * @param options
     */
    getPNG(options?: AvatarExportOptions): string;
    /**
     * Exports the avatar as JPEG data url
     *
     * @param options
     */
    getJPEG(options?: AvatarExportOptions): string;
    /**
     * Exports the avatar as GIF data url
     *
     * @param options
     */
    getGIF(options?: AvatarExportOptions): string;
    /**
     * Exports the avatar as SVG data url
     *
     * @param options
     */
    getSVG(options?: AvatarExportOptions): string;
    /**
     * Exports the avatar in various formats as data url
     *
     * @param format
     * @param options
     */
    getDataUrl(format: string, options: AvatarExportOptions): string;
    /**
     * Resizes the avatar and returns the new canvas
     *
     * @param canvas
     * @param size
     */
    private resize(canvas, size);
    /**
     * Sets a background color and returns the new canvas
     *
     * @param canvas
     * @param color
     */
    private tintBackground(canvas, color);
}
