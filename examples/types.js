// @flow
import * as Immutable from 'immutable';
import ImmutableModel from '../src/ImmutableModel';

export type BarInterface = {
  barStr: string,
  barNum: number,
};

export type FooInterface = {
  str: string,
  num: number,
  obj: Object,
  fn: Function,
  bar: BarInterface,
  list: Immutable.List<BarInterface>,
  map: Immutable.Map<string, any>,
};
