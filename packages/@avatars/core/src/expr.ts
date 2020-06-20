import * as prng from './prng';

export interface IExpression<T = any> {
  0: string;
  1: Array<T | IExpression<T>>;
}

export function includes(search: any, arr: any[]): IExpression {
  return ['$includes', [search, arr]];
}

function resolveIncludes(args: any[]): boolean {
  if (args[0] && Array.isArray(args[1])) {
    return args[1].includes(args[0]);
  }

  throw new Error('Invalid arguments for $includes.');
}

export function every(arr: any): IExpression {
  return ['$every', [arr]];
}

function resolveEvery(args: any[]): boolean {
  if (Array.isArray(args[0])) {
    return args[0].every((v) => v);
  }

  throw new Error('Invalid arguments for $every.');
}

export function some(arr: any): IExpression {
  return ['$some', [arr]];
}

function resolveSome(args: any[]): boolean {
  if (Array.isArray(args[0])) {
    return args[0].some((v) => v);
  }

  throw new Error('Invalid arguments for $some.');
}

export function is(val1: any, val2: any): IExpression {
  return ['$is', [val1, val2]];
}

function resolveIs(args: any[]): boolean {
  return args[0] === args[1];
}

export function isNot(val1: any, val2: any): IExpression {
  return ['$isNot', [val1, val2]];
}

function resolveIsNot(args: any[]): boolean {
  return args[0] !== args[1];
}

export function gt(val1: any, val2: any): IExpression {
  return ['$gt', [val1, val2]];
}

function resolveGt(args: any[]): boolean {
  if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
    return args[0] > args[1];
  }

  throw new Error('Invalid arguments for $gt.');
}

export function gte(val1: any, val2: any): IExpression {
  return ['$gte', [val1, val2]];
}

function resolveGte(args: any[]): boolean {
  if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
    return args[0] >= args[1];
  }

  throw new Error('Invalid arguments for $gte.');
}

export function lt(val1: any, val2: any): IExpression {
  return ['$lt', [val1, val2]];
}

function resolveLt(args: any[]): boolean {
  if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
    return args[0] < args[1];
  }

  throw new Error('Invalid arguments for $lt.');
}

export function lte(val1: any, val2: any): IExpression {
  return ['$lte', [val1, val2]];
}

function resolveLte(args: any[]): boolean {
  if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
    return args[0] <= args[1];
  }

  throw new Error('Invalid arguments for $lte.');
}

export function ref(ref: any): IExpression {
  return ['$ref', [ref]];
}

function resolveRef<T = any>(
  args: any[],
  root: Record<string, any>,
  prng: prng.IPrng,
  callstack: string[],
  nesting: number
): T {
  if (typeof args[0] === 'string') {
    if (callstack.includes(args[0])) {
      throw new Error(`Recursion Error: ${callstack.join(' → ')}`);
    }

    return (root[args[0]] = resolve(root[args[0]], root, prng, [...callstack, args[0]], nesting + 1));
  }

  throw new Error('Invalid arguments for $ref.');
}

export function prngInteger(min: any, max: any): IExpression {
  return ['$prng.integer', [min, max]];
}

function resolvePrngInteger(args: any[], prng: prng.IPrng) {
  if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
    return prng.integer(args[0], args[1]);
  }

  throw new Error('Invalid arguments for $prng.integer.');
}

export function prngBool(likelihood: any): IExpression {
  return ['$prng.bool', [likelihood]];
}

function resolvePrngBool(args: any[], prng: prng.IPrng) {
  if (args[0] === undefined || Number.isInteger(args[0])) {
    return prng.bool(args[0]);
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

export function prngPick(arr: any): IExpression {
  return ['$prng.pick', [arr]];
}

function resolvePrngPick<T = any>(args: Array<T | IExpression<T>>, prng: prng.IPrng): T {
  if (Array.isArray(args[0])) {
    return prng.pick(args[0]);
  }

  throw new Error('Invalid arguments for $prng.bool.');
}

export function resolve(expr: any, root: Record<string, any>, prng: prng.IPrng, callstack: string[], nesting = 0): any {
  if (Array.isArray(expr)) {
    if (typeof expr[0] === 'string' && expr[0][0] === '$') {
      let name = expr[0];
      let args = expr[1];

      if (Array.isArray(args)) {
        args = args.map((v) => resolve(v, root, prng, callstack, nesting + 1));

        switch (name.toLowerCase()) {
          case '$includes':
            return resolveIncludes(args);

          case '$every':
            return resolveEvery(args);

          case '$some':
            return resolveSome(args);

          case '$is':
            return resolveIs(args);

          case '$isnot':
            return resolveIsNot(args);

          case '$gt':
            return resolveGt(args);

          case '$gte':
            return resolveGte(args);

          case '$lt':
            return resolveLt(args);

          case '$lte':
            return resolveLte(args);

          case '$ref':
            return resolveRef(args, root, prng, callstack, nesting);

          case '$prng.integer':
            return resolvePrngInteger(args, prng);

          case '$prng.bool':
            return resolvePrngBool(args, prng);

          case '$prng.pick':
            return resolvePrngPick(args, prng);

          default:
            throw new Error(`Unsupported expression ${expr[0]}`);
        }
      } else {
        throw new Error(`Arguments must be defined as an array. ${typeof args} given.`);
      }
    } else if (nesting === 0) {
      let arr = expr.map((v) => resolve(v, root, prng, callstack, nesting + 1));

      return prng.pick(arr);
    }
  }

  if (typeof expr === 'object' && nesting === 0) {
    let arr = Object.keys(expr).filter((key) => resolve(expr[key], root, prng, callstack, nesting + 1));

    return prng.pick(arr);
  }

  return expr;
}
