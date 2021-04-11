import * as avatars from '@dicebear/avatars';
import * as style from '../lib';

test('micah.create', () => {
    expect(avatars.createAvatar(style)).toContain('svg');
});

test('micah.create.legacy', () => {
    expect(new avatars.default(style.default).create()).toContain('svg');
});
