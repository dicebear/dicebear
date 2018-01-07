export default class Random {
    private prng;
    readonly seed: string;
    constructor(seed: string);
    bool(likelihood?: number): boolean;
    integer(min: number, max: number): number;
    pickone<T>(arr: T[]): T;
}
