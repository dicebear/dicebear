export type ToFormat = (svg: string, format: Format, exif?: Exif) => Result;

export interface Result {
  toDataUri(): Promise<string>;
  toFile(name: string): Promise<void>;
  toArrayBuffer(): Promise<ArrayBufferLike>;
}

export interface Exif {
  [key: string]: string;
}

export type Format = 'svg' | 'png' | 'jpeg';
