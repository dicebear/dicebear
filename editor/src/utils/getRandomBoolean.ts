export default function getRandomBoolean(probability: number): boolean {
  return Math.random() * 100 <= probability;
}
