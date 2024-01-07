import * as color from '../../lib/utils/color.js';
import { create as createPrng } from '../../lib/utils/prng.js';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

test('Convert color', () => {
  equal(color.convertColor('000'), '#000');
  equal(color.convertColor('transparent'), 'transparent');
});

test('Zero background colors', () => {
  const prng = createPrng('test-seed');

  equal(color.getBackgroundColors(prng, [], 'linear'), {
    primary: 'transparent',
    secondary: 'transparent',
  });
});

test('One background color', () => {
  const prng = createPrng('test-seed');

  equal(color.getBackgroundColors(prng, ['fff'], 'linear'), {
    primary: '#fff',
    secondary: '#fff',
  });
});

test('Two background colors', () => {
  const prng = createPrng('test-seed');

  // Solid
  equal(
    // 1
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#fff',
      secondary: '#000',
    }
  );
  equal(
    // 2
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#fff',
      secondary: '#000',
    }
  );
  equal(
    // 3
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#000',
      secondary: '#fff',
    }
  );
  equal(
    // 4
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#fff',
      secondary: '#000',
    }
  );
  equal(
    // 5
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#fff',
      secondary: '#000',
    }
  );
  equal(
    // 6
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#000',
      secondary: '#fff',
    }
  );
  equal(
    // 7
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#fff',
      secondary: '#000',
    }
  );
  equal(
    // 8
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#fff',
      secondary: '#000',
    }
  );
  equal(
    // 9
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#fff',
      secondary: '#000',
    }
  );
  equal(
    // 10
    color.getBackgroundColors(prng, ['000', 'fff'], 'solid'),
    {
      primary: '#000',
      secondary: '#fff',
    }
  );

  // Linear Gradient
  for (let i = 0; i < 10; i++) {
    equal(color.getBackgroundColors(prng, ['000', 'fff'], 'gradientLinear'), {
      primary: '#000',
      secondary: '#fff',
    });
  }
});

test('Multiple background colors', () => {
  const prng = createPrng('test-seed');

  equal(
    // 1
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#111',
      secondary: '#222',
    }
  );

  equal(
    // 2
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#222',
      secondary: '#111',
    }
  );

  equal(
    // 3
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#111',
      secondary: '#000',
    }
  );

  equal(
    // 4
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#222',
      secondary: '#111',
    }
  );

  equal(
    // 5
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#222',
      secondary: '#111',
    }
  );

  equal(
    // 6
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#222',
      secondary: '#000',
    }
  );

  equal(
    // 7
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#222',
      secondary: '#111',
    }
  );

  equal(
    // 8
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#222',
      secondary: '#111',
    }
  );

  equal(
    // 9
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#222',
      secondary: '#111',
    }
  );

  equal(
    // 10
    color.getBackgroundColors(prng, ['000', '111', '222'], 'solid'),
    {
      primary: '#000',
      secondary: '#111',
    }
  );
});

test.run();
