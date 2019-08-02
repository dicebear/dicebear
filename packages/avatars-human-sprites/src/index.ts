import Male from '@dicebear/avatars-male-sprites';
import Female from '@dicebear/avatars-female-sprites';
import Random from '@dicebear/avatars/lib/random';

type Options = {
  mood?: Array<'happy' | 'sad' | 'surprised'>;
};

export default function(options: Options = {}) {
  const male = Male(options);
  const female = Female(options);

  return function(random: Random) {
    if (random.bool(50)) {
      return male(random);
    } else {
      return female(random);
    }
  };
}
