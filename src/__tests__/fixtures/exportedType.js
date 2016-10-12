// @flow
import ImmutableState from '../../../src/ImmutableState';

export type Bar = {
  str: string,
  num: number,
  obj: Object,
};

export type Foo = {
  str: ?string,
  num: ?number,
  obj: ?Object,
  bar: Bar,
  fn: Function
};
