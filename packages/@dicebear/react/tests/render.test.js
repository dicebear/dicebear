import * as React from 'react';
import { render, waitFor, within } from '@testing-library/react';
import { test } from 'uvu';
import { match } from 'uvu/assert';
import * as style from '@dicebear/pixel-art';
import { setup, reset } from './setup/index.js';

import { Avatar } from '../lib/index.js';

test.before(setup);
test.before.each(reset);

test('shows default window size correctly', async () => {
  const { container } = render(
    React.createElement(Avatar, { style, alt: 'Avatar' })
  );

  await waitFor(() => within(container).getByAltText('Avatar'));

  match(container.innerHTML, /src="data:/);
});

test.run();
