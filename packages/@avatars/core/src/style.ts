import type * as svgson from 'svgson';
import { IExpression } from './expr';

export type IStyleOptions<O = {}> = {
  seed?: string | IExpression<string>;
  radius?: number | IExpression<number>;
  r?: number | IExpression<number>;
  base64?: boolean | IExpression<boolean>;
  width?: number | IExpression<number>;
  w?: number | IExpression<number>;
  height?: number | IExpression<number>;
  h?: number | IExpression<number>;
  margin?: number | IExpression<number>;
  m?: number | IExpression<number>;
  background?: string | IExpression<string>;
  b?: number | IExpression<number>;
} & O;

export interface IStyleGenerator<O = {}> {
  (options: Partial<IStyleOptions & O>): string | svgson.INode;
}

export interface IStyle<O = {}> {
  options: IStyleOptions & O;
  generator: IStyleGenerator<O>;
}
