// @flow
import * as Immutable from 'immutable';
import ImmutableState from '../src/ImmutableState';

export type FooInterface = {
  str: string,
  num: number,
  obj: Object,
  fn: Function,
  list: Immutable.List<any>,
  map: Immutable.Map<string, any>,
};
