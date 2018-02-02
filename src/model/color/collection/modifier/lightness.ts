import * as Brighter from './lightness/brighter';
import * as Darker from './lightness/darker';
import * as Difference from './lightness/difference';

export default class Lightness {
  public static brighter = Brighter;
  public static darker = Darker;
  public static difference = Difference;
}

module.exports = Lightness;
