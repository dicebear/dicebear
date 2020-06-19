export interface IPrng {
    seed: string;
    bool(likelihood?: number): boolean;
    integer(min: number, max: number): number;
    pick<T>(arr: T[]): T;
}
export declare function create(seed: string): IPrng;
