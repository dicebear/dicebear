import { createAvatar } from '@dicebear/core';
import { identicon } from '../../../lib/index.js';

document.body.innerHTML = createAvatar(identicon, { seed: 'John Doe' });
