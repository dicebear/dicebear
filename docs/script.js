$(document).ready(function() {
    $('.api-endpoint').text(API_ENDPOINT);

    var maleAvatar = new Avatars(Avatars.SPRITE_SETS.male, { size: 200 });
    var femaleAvatar = new Avatars(Avatars.SPRITE_SETS.female, { size: 200 });

    // Seed Form
    var maleAvatarImage = $('#avatar-male');
    var femaleAvatarImage = $('#avatar-female');

    var seedInput = $('#seed');
    var seedSpan = $('.seed');

    var createAvatars = function() {
        var seed = seedInput.val();

        maleAvatar.create(seedInput.val(), {}, function (err, canvas) {
            if (seed == seedInput.val()) {
                maleAvatarImage.attr('src', canvas.toDataURL());
            }
        });

        femaleAvatar.create(seedInput.val(), {}, function (err, canvas) {
            if (seed == seedInput.val()) {
                femaleAvatarImage.attr('src', canvas.toDataURL());
            }
        });

        seedSpan.text(encodeURIComponent(seed || 'custom-seed'));
    }

    seedInput.on('input', createAvatars);

    createAvatars();

    // Infinite
    var infinite = $('#infinite');
    var infiniteDummy = infinite.children().first();
    var infiniteChance = new Chance('fixed-seed');

    var fillInfinite = function() {
        // documentBottomPosition + 400 preload area
        var documentBottomPosition = $(window).scrollTop() + $(window).height() + 400;

        while (infiniteDummy.offset().top < documentBottomPosition) {
            var newAvatar = infiniteDummy.clone();
            var newAvatarGender = infiniteChance.pickone(['male', 'female']);
            var newAvatarName = infiniteChance.name({ gender: newAvatarGender });
            var newAvatarUrl = API_ENDPOINT+'v1/'+newAvatarGender+'/'+encodeURIComponent(newAvatarName)+'/200.png';

            newAvatar
                .find('a')
                .attr('href', newAvatarUrl);

            newAvatar
                .find('img')
                .attr('src', newAvatarUrl)
                .attr('alt', newAvatarName);

            newAvatar
                .find('.name')
                .text(newAvatarName);
            
            newAvatar.insertBefore(infiniteDummy);
        }
    }

    $(document).on('scroll', fillInfinite);

    fillInfinite();
});
