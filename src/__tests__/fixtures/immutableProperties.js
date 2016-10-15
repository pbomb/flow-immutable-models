// @flow
import * as Immutable from 'immutable';
import type { BarInterface } from './bar';
import { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooInterface = {
  list: Immutable.List<any>,
  maybeList: ?Immutable.List<BarInterface>,
  map: Immutable.Map<any, any>,
  maybeMap: ?Immutable.Map<string, BarInterface>,
};
