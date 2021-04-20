import { utils } from '../../lib';

test('Predictable PNGR integers', () => {
    const pngr = utils.prng.create('test-seed-1');

    expect(pngr.integer(0, 10)).toEqual(2);
    expect(pngr.integer(0, 10)).toEqual(7);
    expect(pngr.integer(0, 10)).toEqual(2);

    expect(pngr.integer(10, 20)).toEqual(19);
    expect(pngr.integer(10, 20)).toEqual(14);
    expect(pngr.integer(10, 20)).toEqual(11);

    expect(pngr.integer(-1, 0)).toEqual(-1);
    expect(pngr.integer(0, 0)).toEqual(0);
    expect(pngr.integer(1, 1)).toEqual(1);
});

test('Predictable PNGR array values', () => {
    const pngr = utils.prng.create('test-seed-2');
    const arr = ['A', 'B', 'C', 'D', 'E', 'F'];

    expect(pngr.pick(arr)).toEqual('A');
    expect(pngr.pick(arr)).toEqual('A');
    expect(pngr.pick(arr)).toEqual('E');
    expect(pngr.pick(arr)).toEqual('D');
    expect(pngr.pick(arr)).toEqual('F');
    expect(pngr.pick(arr)).toEqual('A');

    expect(pngr.pick(['A'])).toEqual('A');
    expect(pngr.pick([])).toEqual(undefined);
});

test('Predictable PNGR booleans', () => {
    const pngr = utils.prng.create('test-seed-3');

    expect(pngr.bool(100)).toEqual(true);
    expect(pngr.bool(100)).toEqual(true);
    expect(pngr.bool(100)).toEqual(true);

    expect(pngr.bool(75)).toEqual(true);
    expect(pngr.bool(75)).toEqual(true);
    expect(pngr.bool(75)).toEqual(false);

    expect(pngr.bool(50)).toEqual(true);
    expect(pngr.bool(50)).toEqual(true);
    expect(pngr.bool(50)).toEqual(false);

    expect(pngr.bool(25)).toEqual(true);
    expect(pngr.bool(25)).toEqual(true);
    expect(pngr.bool(25)).toEqual(false);

    expect(pngr.bool(0)).toEqual(false);
    expect(pngr.bool(0)).toEqual(false);
    expect(pngr.bool(0)).toEqual(false);
});
