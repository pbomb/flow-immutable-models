// @flow
import type { Bar } from './bar';
import ImmutableModel from '../../../src/ImmutableModel';

export type FooInterface = {
  ref: Bar,
  maybeRef: ?Bar,
  str: string,
};
