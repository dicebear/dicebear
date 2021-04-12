import * as avatars from '@dicebear/avatars';
import * as style from '../lib';

test('Simple create', () => {
    expect(avatars.createAvatar(style)).toContain('svg');
});

test('Simple legacy create', () => {
    expect(new avatars.default(style.default).create()).toContain('svg');
});
