// @flow
import * as Immutable from 'immutable';
import type { BarModelType } from './bar';
import { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooModelType = {
  list: Immutable.List<any>,
  maybeList: ?Immutable.List<BarModelType>,
  map: Immutable.Map<any, any>,
  maybeMap: ?Immutable.Map<string, BarModelType>,
};
