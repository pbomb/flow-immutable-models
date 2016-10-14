// @flow
import * as Immutable from 'immutable';
import type { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooInterface = {
  list: Immutable.List<any>,
  maybeList: ?Immutable.List<Bar>,
  map: Immutable.Map<any, any>,
  maybeMap: ?Immutable.Map<string, Bar>,
};
