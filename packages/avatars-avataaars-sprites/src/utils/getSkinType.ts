import { skin } from '../paths';

export default function (): (color: string) => string {
  return skin.default;
}
