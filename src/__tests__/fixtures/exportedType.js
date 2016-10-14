// @flow
import type { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooInterface = {
  maybeStr: ?string,
  str: string,
  maybeNum: ?number,
  num: number,
  maybeObj: ?Object,
  obj: Object,
  maybeBar: ?Bar,
  bar: Bar,
  maybeFn: ?Function,
  fn: Function,
};
