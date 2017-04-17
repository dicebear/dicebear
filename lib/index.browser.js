var avatars = require('./avatars').default;
avatars.SPRITE_SETS = {
    female: require('./spriteSets/female').default,
    male: require('./spriteSets/male').default
};
module.exports = avatars;
