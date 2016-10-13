// @flow
import * as Immutable from 'immutable';
import type { Bar } from './bar';
import ImmutableState from '../../../src/ImmutableState';

export type FooInterface = {
  list: Immutable.List<any>,
  maybeList: ?Immutable.List<Bar>,
  map: Immutable.Map<any, any>,
  maybeMap: ?Immutable.Map<string, Bar>,
};
