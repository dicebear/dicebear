import { default as Avatars, createAvatar } from '@dicebear/avatars';
import * as style from '../lib';

test('avataaars.create', () => {
    expect(createAvatar(style)).toContain('svg');
});
