import { default as Avatars, createAvatar } from '@dicebear/avatars';
import legacyStyle from '../lib';

test('avataaars.create.legacy', () => {
    expect(new Avatars(legacyStyle).create()).toContain('svg');
});
