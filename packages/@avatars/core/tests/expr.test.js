const Avatars = require('../');

const prng = Avatars.prng.create('');
const exprResolve = (expr) => Avatars.expr.resolve(expr, {}, prng, [], 1);

test('$includes expression', () => {
  expect(exprResolve(Avatars.expr.includes('foo', ['foo']))).toBeTruthy();
  expect(exprResolve(Avatars.expr.includes('bar', ['foo']))).toBeFalsy();
});

test('$every expression', () => {
  expect(exprResolve(Avatars.expr.every([true, true]))).toBeTruthy();
  expect(exprResolve(Avatars.expr.every([true, false]))).toBeFalsy();
});

test('$some expression', () => {
  expect(exprResolve(Avatars.expr.some([true, false]))).toBeTruthy();
  expect(exprResolve(Avatars.expr.some([false, false]))).toBeFalsy();
});

test('$is expression', () => {
  expect(exprResolve(Avatars.expr.is('foo', 'foo'))).toBeTruthy();
  expect(exprResolve(Avatars.expr.is('foo', 'bar'))).toBeFalsy();
});

test('$isNot expression', () => {
  expect(exprResolve(Avatars.expr.isNot('foo', 'bar'))).toBeTruthy();
  expect(exprResolve(Avatars.expr.isNot('foo', 'foo'))).toBeFalsy();
});

test('$gt expression', () => {
  expect(exprResolve(Avatars.expr.gt(10, 5))).toBeTruthy();
  expect(exprResolve(Avatars.expr.gt(10, 10))).toBeFalsy();
});

test('$gte expression', () => {
  expect(exprResolve(Avatars.expr.gte(10, 10))).toBeTruthy();
  expect(exprResolve(Avatars.expr.gte(5, 10))).toBeFalsy();
});

test('$lt expression', () => {
  expect(exprResolve(Avatars.expr.lt(5, 10))).toBeTruthy();
  expect(exprResolve(Avatars.expr.lt(10, 10))).toBeFalsy();
});

test('$lte expression', () => {
  expect(exprResolve(Avatars.expr.lte(10, 10))).toBeTruthy();
  expect(exprResolve(Avatars.expr.lte(10, 5))).toBeFalsy();
});

test('$ref expression', () => {
  let object = {
    foo: 'foo',
    bar: Avatars.expr.ref('foo'),
  };

  expect(Avatars.expr.resolve(object.bar, object, prng, ['bar'])).toBe('foo');
});

test('$ref expression recursive', () => {
  let object = {
    foo: Avatars.expr.ref('bar'),
    bar: Avatars.expr.ref('foo'),
  };

  expect(() => Avatars.expr.resolve(object.bar, object, prng, ['bar'])).toThrow(/Recursion/);
});

test('$prng.bool expression', () => {
  expect(exprResolve(Avatars.expr.prngBool(100))).toBeTruthy();
});

test('$prng.pick expression', () => {
  expect(exprResolve(Avatars.expr.prngPick([10]))).toBe(10);
});

test('$prng.integer expression', () => {
  expect(exprResolve(Avatars.expr.prngInteger(10, 10))).toBe(10);
});
