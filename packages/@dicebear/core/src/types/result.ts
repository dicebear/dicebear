export interface Result {
  toString(): string;
  toJson(): {
    svg: string;
    extra: Record<string, unknown>;
  };
  toDataUri(): string;
}
