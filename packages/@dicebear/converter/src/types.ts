export type ToFormat = (
  svg: string,
  format: Format,
  exif?: Exif
) => BinaryResult;

export interface BinaryResult {
  toDataUri(): Promise<string>;
  toFile(name: string): Promise<void>;
  toArrayBuffer(): Promise<ArrayBuffer>;
}

export interface Exif {
  [key: string]: string;
}

export type Format = 'svg' | 'png' | 'jpeg';
