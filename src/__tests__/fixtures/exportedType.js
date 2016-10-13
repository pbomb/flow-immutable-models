// @flow
import type { Bar } from './bar';
import ImmutableState from '../../../src/ImmutableState';

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
