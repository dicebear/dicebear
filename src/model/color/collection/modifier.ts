import * as Lightness from './modifier/lightness';
import * as Opacity from './modifier/opacity';

export default class Modifier {
  public static lightness = Lightness;
  public static opacity = Opacity;
}

module.exports = Modifier;
