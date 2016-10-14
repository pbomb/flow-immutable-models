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
  bar: Bar,
  list: Immutable.List<Bar>,
  map: Immutable.Map<string, any>,
};
