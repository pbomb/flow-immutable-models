// @flow
import type { BarInterface } from './bar';
import { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooInterface = {
  ref: BarInterface,
  maybeRef: ?BarInterface,
  str: string,
};
