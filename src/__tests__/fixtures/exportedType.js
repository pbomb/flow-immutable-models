// @flow
import type { BarInterface } from './bar';
import { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooInterface = {
  maybeStr: ?string,
  str: string,
  maybeNum: ?number,
  num: number,
  maybeObj: ?Object,
  obj: Object,
  maybeBar: ?BarInterface,
  bar: BarInterface,
  maybeFn: ?Function,
  fn: Function,
};
