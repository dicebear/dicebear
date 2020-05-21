export default interface IOptions {
  gender?: 'male' | 'female';
  mood?: Array<'happy' | 'sad' | 'surprised'>;
  skinColor?: number[];
  maleMustacheProbability?: number;
  maleGlassesProbability?: number;
  maleHairProbability?: number;
  maleHatProbability?: number;
  femaleAccessoriesProbability?: number;
  femaleGlassesProbability?: number;
  femaleHatProbability?: number;
}
