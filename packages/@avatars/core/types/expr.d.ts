import * as prng from './prng';
export interface IExpression<T = any> {
    0: string;
    1: Array<T | IExpression<T>>;
}
export declare function includes(search: any, arr: any[]): IExpression;
export declare function every(arr: any): IExpression;
export declare function some(arr: any): IExpression;
export declare function is(val1: any, val2: any): IExpression;
export declare function isNot(val1: any, val2: any): IExpression;
export declare function gt(val1: any, val2: any): IExpression;
export declare function gte(val1: any, val2: any): IExpression;
export declare function lt(val1: any, val2: any): IExpression;
export declare function lte(val1: any, val2: any): IExpression;
export declare function ref(ref: any): IExpression;
export declare function prngInteger(min: any, max: any): IExpression;
export declare function prngBool(likelihood: any): IExpression;
export declare function prngPick(arr: any): IExpression;
export declare function resolve(expr: any, root: Record<string, any>, prng: prng.IPrng, callstack: string[]): any;
