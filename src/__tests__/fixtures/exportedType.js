// @flow
import type { BarModelType } from './bar';
import { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooModelType = {
  maybeStr: ?string,
  str: string,
  maybeNum: ?number,
  num: number,
  maybeObj: ?Object,
  obj: Object,
  maybeBar: ?BarModelType,
  bar: BarModelType,
  maybeFn: ?Function,
  fn: Function,
};
